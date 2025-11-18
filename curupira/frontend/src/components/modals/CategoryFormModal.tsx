import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { categoriesApi, type Category } from '~/apis';

const categorySchema = z.object({ name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo') });

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId?: number;
}

export const CategoryFormModal = ({ open, onOpenChange, categoryId }: CategoryFormModalProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!categoryId;

  const { data: category, isLoading: loadingCategory } = useQuery<Category>({
    queryKey: ['category', categoryId],
    queryFn: () => categoriesApi.get(categoryId!),
    enabled: isEditing && !!categoryId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CategoryFormData>({ resolver: zodResolver(categorySchema), defaultValues: { name: '' } });

  useEffect(() => {
    if (category) {
      setValue('name', category.name);
    } else if (!isEditing) {
      reset({ name: '' });
    }
  }, [category, setValue, reset, isEditing]);

  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) => {
      return categoriesApi.create({ name: data.name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoria criada com sucesso!');
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erro ao criar categoria');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CategoryFormData) => {
      return categoriesApi.update(categoryId!, { name: data.name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', categoryId] });
      toast.success('Categoria atualizada com sucesso!');
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erro ao atualizar categoria');
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Atualize as informações da categoria' : 'Preencha os dados para criar uma nova categoria'}
          </DialogDescription>
        </DialogHeader>

        {isEditing && loadingCategory ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Carregando categoria...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ex: Transporte, Energia, Alimentação"
                disabled={createMutation.isPending || updateMutation.isPending}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending
                  ? 'Salvando...'
                  : isEditing
                    ? 'Atualizar'
                    : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
