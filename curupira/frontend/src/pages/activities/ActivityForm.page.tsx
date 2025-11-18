import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';
import { activitiesApi, categoriesApi, type Activity, type Category } from '~/apis';

const activitySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200, 'Nome muito longo'),
  category: z.number().min(1, 'Categoria é obrigatória'),
  unitType: z.string().min(1, 'Tipo de unidade é obrigatório'),
  unit: z.string().min(1, 'Unidade é obrigatória').max(50, 'Unidade muito longa'),
  source: z.string().max(100, 'Fonte muito longa').optional(),
  region: z.string().max(50, 'Região muito longa').optional(),
  notes: z.string().optional(),
});

type ActivityFormData = z.infer<typeof activitySchema>;

export const ActivityFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
  });

  const { data: activity, isLoading: loadingActivity } = useQuery<Activity>({
    queryKey: ['activity', id],
    queryFn: () => activitiesApi.get(Number(id!)),
    enabled: isEditing,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: { name: '', category: undefined, unitType: '', unit: '', source: '', region: '', notes: '' },
  });

  useEffect(() => {
    if (activity) {
      setValue('name', activity.name);
      setValue('category', activity.category.id);
      setValue('unitType', activity.unitType);
      setValue('unit', activity.unit);
      setValue('source', activity.source || '');
      setValue('region', activity.region || '');
      setValue('notes', activity.notes || '');
    }
  }, [activity, setValue]);

  const createMutation = useMutation({
    mutationFn: (data: ActivityFormData) => {
      const category = categories.find((c) => c.id === data.category);
      if (!category) throw new Error('Categoria não encontrada');

      return activitiesApi.create({
        name: data.name,
        category,
        unitType: data.unitType,
        unit: data.unit,
        source: data.source || undefined,
        region: data.region || undefined,
        notes: data.notes || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Atividade criada com sucesso!');
      navigate('/activities');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erro ao criar atividade');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ActivityFormData) => {
      const category = categories.find((c) => c.id === data.category);
      if (!category) throw new Error('Categoria não encontrada');

      return activitiesApi.update(Number(id!), {
        name: data.name,
        category,
        unitType: data.unitType,
        unit: data.unit,
        source: data.source || undefined,
        region: data.region || undefined,
        notes: data.notes || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', id] });
      toast.success('Atividade atualizada com sucesso!');
      navigate('/activities');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erro ao atualizar atividade');
    },
  });

  const onSubmit = (data: ActivityFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const selectedCategory = watch('category');

  if (isEditing && loadingActivity) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando atividade...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link to="/activities">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditing ? 'Editar Atividade' : 'Nova Atividade'}</h1>
          <p className="text-muted-foreground mt-2">
            {isEditing ? 'Atualize as informações da atividade' : 'Preencha os dados para criar uma nova atividade'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input id="name" {...register('name')} placeholder="Ex: Viagem de carro" />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <Select value={selectedCategory?.toString()} onValueChange={(value) => setValue('category', Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="unitType">Tipo de Unidade *</Label>
            <Input id="unitType" {...register('unitType')} placeholder="Ex: distance, time, volume" />
            {errors.unitType && <p className="text-sm text-destructive">{errors.unitType.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unidade *</Label>
            <Input id="unit" {...register('unit')} placeholder="Ex: km, h, L" />
            {errors.unit && <p className="text-sm text-destructive">{errors.unit.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="source">Fonte</Label>
            <Input id="source" {...register('source')} placeholder="Ex: IPCC, EPA" />
            {errors.source && <p className="text-sm text-destructive">{errors.source.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Região</Label>
            <Input id="region" {...register('region')} placeholder="Ex: BR, US" />
            {errors.region && <p className="text-sm text-destructive">{errors.region.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea id="notes" {...register('notes')} placeholder="Observações adicionais sobre a atividade" rows={4} />
          {errors.notes && <p className="text-sm text-destructive">{errors.notes.message}</p>}
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link to="/activities">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </div>
  );
};
