import { AppHeader } from '@/components/AppHeader'
import { Outlet, useLocation } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

export function AppLayout() {
  const location = useLocation()

  const maxWidth = location.pathname.includes('blog-faq')
    ? 'w-full'
    : 'max-w-[1600px]'
  const padding = location.pathname.includes('blog-faq') ? '!p-0' : 'p-8'

  return (
    <div className="min-h-screen flex flex-col w-full">
      <AppHeader />
      <main className={twMerge('flex-1 overflow-auto', padding)}>
        <div className={twMerge('mx-auto', maxWidth)}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
