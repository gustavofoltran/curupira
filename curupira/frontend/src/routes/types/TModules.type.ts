export type TModule = {
  title: string
  icon: React.ReactNode
  path: string
  submodules: {
    title: string
    path: string
    permission: string | null
    component: React.ReactNode
    showSidebar: boolean
  }[]
}
export type TModules = TModule[]
