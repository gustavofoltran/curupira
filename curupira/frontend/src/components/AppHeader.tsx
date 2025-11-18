import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { APP_DOMAIN, APP_NAME } from '@/constants/app';
import { cn } from '@/lib/utils';
import { Activity, Calculator, FolderTree, LayoutDashboard, Maximize2, Minimize2, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { id: 'menu-dashboard', title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { id: 'menu-activities', title: 'Atividades', url: '/activities', icon: Activity },
  { id: 'menu-categories', title: 'Categorias', url: '/categories', icon: FolderTree },
  { id: 'menu-emission-calculator', title: 'Calculadora', url: '/emission-calculator', icon: Calculator },
];

export function AppHeader() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Erro ao alternar tela cheia:', error);
    }
  };

  const handleLogout = () => {
    // @ TODO: Implement logout
  };

  const getInitials = (email?: string) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      {/* Logo e Nome */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-none">{APP_NAME}</h2>
            <p className="text-xs text-muted-foreground leading-none">{APP_DOMAIN}</p>
          </div>
        </Link>
      </div>

      {/* Navegação */}
      <nav className="flex items-center gap-1 flex-1 justify-center">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.url || (item.url !== '/' && location.pathname.startsWith(item.url));
          return (
            <Link
              key={item.id}
              id={item.id}
              to={item.url}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Ações do usuário */}
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              <span className="sr-only">Toggle fullscreen</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isFullscreen ? 'Sair da tela cheia' : 'Entrar em tela cheia'}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
