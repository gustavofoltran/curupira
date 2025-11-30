import { ActivityFormModal } from '@/components/modals'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Activity as ActivityIcon, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  activitiesApi,
  categoriesApi,
  type Activity,
  type Category,
} from '~/apis'

export const ActivitiesListPage = () => {
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(
    null,
  )
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingActivityId, setEditingActivityId] = useState<
    number | undefined
  >(undefined)

  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ['activities'],
    queryFn: () => activitiesApi.list(),
  })

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => activitiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      toast.success('Atividade deletada com sucesso!')
      setDeleteDialogOpen(false)
      setActivityToDelete(null)
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erro ao deletar atividade')
    },
  })

  const handleDelete = (activity: Activity) => {
    setActivityToDelete(activity)
    setDeleteDialogOpen(true)
  }

  const handleEdit = (activity: Activity) => {
    setEditingActivityId(activity.id)
    setFormModalOpen(true)
  }

  const handleCreate = () => {
    setEditingActivityId(undefined)
    setFormModalOpen(true)
  }

  const handleModalClose = (open: boolean) => {
    setFormModalOpen(open)
    if (!open) {
      setEditingActivityId(undefined)
    }
  }

  const confirmDelete = () => {
    if (activityToDelete) {
      deleteMutation.mutate(activityToDelete.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Atividades</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as atividades que geram emissões de carbono
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Atividade
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando atividades...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <ActivityIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Nenhuma atividade cadastrada
          </h3>
          <p className="text-muted-foreground mb-4">
            Comece criando sua primeira atividade
          </p>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeira Atividade
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo de Unidade</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead>Região</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {activity.category.name}
                    </span>
                  </TableCell>
                  <TableCell>{activity.unitType}</TableCell>
                  <TableCell>{activity.unit}</TableCell>
                  <TableCell>{activity.source || '-'}</TableCell>
                  <TableCell>{activity.region || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(activity)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(activity)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a atividade "
              {activityToDelete?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setActivityToDelete(null)
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ActivityFormModal
        open={formModalOpen}
        onOpenChange={handleModalClose}
        activityId={editingActivityId}
      />
    </div>
  )
}
