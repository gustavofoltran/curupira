import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'
import { categoriesApi, type Category } from '~/apis'

const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
})

type CategoryFormData = z.infer<typeof categorySchema>

export const CategoryFormPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = !!id

  const { data: category, isLoading: loadingCategory } = useQuery<Category>({
    queryKey: ['category', id],
    queryFn: () => categoriesApi.get(Number(id!)),
    enabled: isEditing,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
    },
  })

  useEffect(() => {
    if (category) {
      setValue('name', category.name)
    }
  }, [category, setValue])

  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) => {
      return categoriesApi.create({
        name: data.name,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Categoria criada com sucesso!')
      navigate('/categories')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erro ao criar categoria')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: CategoryFormData) => {
      return categoriesApi.update(Number(id!), {
        name: data.name,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category', id] })
      toast.success('Categoria atualizada com sucesso!')
      navigate('/categories')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erro ao atualizar categoria')
    },
  })

  const onSubmit = (data: CategoryFormData) => {
    if (isEditing) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  if (isEditing && loadingCategory) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando categoria...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 ">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link to="/categories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEditing
              ? 'Atualize as informações da categoria'
              : 'Preencha os dados para criar uma nova categoria'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Ex: Transporte, Energia, Alimentação"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link to="/categories">Cancelar</Link>
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? 'Salvando...'
              : isEditing
                ? 'Atualizar'
                : 'Criar'}
          </Button>
        </div>
      </form>
    </div>
  )
}
