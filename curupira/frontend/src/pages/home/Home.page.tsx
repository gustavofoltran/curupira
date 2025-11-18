import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import {
  Activity as ActivityIcon,
  FolderTree,
  Leaf,
  TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  activitiesApi,
  categoriesApi,
  type Activity,
  type Category,
} from '~/apis'

export const HomePage = () => {
  const { data: activities = [], isLoading: activitiesLoading } = useQuery<
    Activity[]
  >({
    queryKey: ['activities'],
    queryFn: () => activitiesApi.list(),
  })

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
  })

  const isLoading = activitiesLoading || categoriesLoading

  // Agrupar atividades por categoria
  const activitiesByCategory = activities.reduce(
    (acc, activity) => {
      const categoryName = activity.category.name
      if (!acc[categoryName]) {
        acc[categoryName] = []
      }
      acc[categoryName].push(activity)
      return acc
    },
    {} as Record<string, Activity[]>,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Curupira
        </h1>
        <p className="text-muted-foreground mt-2">
          Sistema de gestão de atividades e cálculo de emissões de carbono
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Atividades
            </CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : activities.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Atividades cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : categories.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Categorias disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Atividades por Categoria
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : Object.keys(activitiesByCategory).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Categorias com atividades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sistema</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Curupira</div>
            <p className="text-xs text-muted-foreground">Gestão de emissões</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações rápidas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/activities">
                <ActivityIcon className="mr-2 h-4 w-4" />
                Gerenciar Atividades
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/categories">
                <FolderTree className="mr-2 h-4 w-4" />
                Gerenciar Categorias
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/emission-calculator">
                <TrendingUp className="mr-2 h-4 w-4" />
                Calculadora de Emissão
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividades por Categoria</CardTitle>
            <CardDescription>
              Distribuição das atividades cadastradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : Object.keys(activitiesByCategory).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma atividade cadastrada ainda.
              </p>
            ) : (
              <div className="space-y-2">
                {Object.entries(activitiesByCategory).map(
                  ([category, categoryActivities]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm text-muted-foreground">
                        {categoryActivities.length} atividade(s)
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
