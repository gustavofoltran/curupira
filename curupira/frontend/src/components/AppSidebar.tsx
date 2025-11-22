// import { Coachmark, useCoachmark } from "@/components/ui/coachmark";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { APP_DOMAIN, APP_NAME } from '@/constants/app'
import { Activity, Calculator, FolderTree, LayoutDashboard } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  {
    id: 'menu-dashboard',
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
    featureFlag: undefined,
  },
  {
    id: 'menu-activities',
    title: 'Atividades',
    url: '/activities',
    icon: Activity,
    featureFlag: undefined,
  },
  {
    id: 'menu-categories',
    title: 'Categorias',
    url: '/categories',
    icon: FolderTree,
    featureFlag: undefined,
  },
  {
    id: 'menu-emission-calculator',
    title: 'Calculadora de Emissão',
    url: '/emission-calculator',
    icon: Calculator,
    featureFlag: undefined,
  },
]

export function AppSidebar() {
  const location = useLocation()

  // Temporariamente desabilitado o coachmark para evitar erros
  // const coachmark = useCoachmark({
  //   id: "platform-tour",
  //   steps: [
  //     {
  //       target: "#sidebar-logo",
  //       title: `🎉 Bem-vindo ao ${APP_NAME}!`,
  //       description:
  //         "Esta é sua plataforma completa para gerenciar atividades e calcular emissões de carbono. Vamos fazer um tour rápido pelas principais funcionalidades!",
  //       position: "right",
  //       spotlightPadding: 16,
  //     },
  //     {
  //       target: "#menu-dashboard",
  //       title: "📊 Dashboard",
  //       description:
  //         "Aqui você encontra um resumo completo das suas atividades: estatísticas, categorias e atalhos rápidos para as principais funcionalidades.",
  //       position: "right",
  //       spotlightPadding: 12,
  //     },
  //     {
  //       target: "#menu-activities",
  //       title: "🔍 Atividades",
  //       description:
  //         "Gerencie todas as atividades que geram emissões de carbono. Crie, edite e visualize atividades cadastradas.",
  //       position: "right",
  //       spotlightPadding: 12,
  //     },
  //     {
  //       target: "#menu-categories",
  //       title: "📁 Categorias",
  //       description:
  //         "Organize suas atividades em categorias. Crie e gerencie categorias para melhor organização.",
  //       position: "right",
  //       spotlightPadding: 12,
  //     },
  //     {
  //       target: "#menu-emission-calculator",
  //       title: "🧮 Calculadora",
  //       description:
  //         "Calcule as emissões de carbono para diferentes atividades usando a calculadora integrada.",
  //       position: "right",
  //       spotlightPadding: 12,
  //     },
  //   ],
  //   autoStart: true,
  //   autoStartDelay: 1500,
  // });

  return (
    <>
      <Sidebar className="border-r border-border/40">
        <SidebarHeader className="border-b border-border/40 p-6">
          <div id="sidebar-logo" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{APP_NAME}</h2>
              <p className="text-xs text-muted-foreground">{APP_DOMAIN}</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1 px-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    location.pathname === item.url ||
                    (item.url !== '/' && location.pathname.startsWith(item.url))
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`${
                          isActive
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                            : 'hover:bg-accent/50 '
                        } transition-colors`}
                      >
                        <Link id={item.id} to={item.url}>
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Coachmark do tour da plataforma - Temporariamente desabilitado */}
      {/* <Coachmark {...coachmark.props} /> */}
    </>
  )
}
