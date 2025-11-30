import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { APP_DOMAIN, APP_NAME } from '@/constants/app';
import { cn } from '@/lib/utils';
import {
  Activity,
  Calculator,
  FolderTree,
  History,
  LayoutDashboard,
  Maximize2,
  Menu,
  Minimize2,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '~/contexts/AuthContext';
import { useIsMobile } from '~/hooks/use-mobile';

const menuItems = [
  { id: 'menu-dashboard', title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { id: 'menu-activities', title: 'Atividades', url: '/activities', icon: Activity },
  { id: 'menu-categories', title: 'Categorias', url: '/categories', icon: FolderTree },
  { id: 'menu-emission-calculator', title: 'Calculadora', url: '/emission-calculator', icon: Calculator },
  { id: 'menu-history', title: 'Histórico', url: '/history', icon: History },
];

export function AppHeader() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMobile = useIsMobile();
  const { isAuthenticated, logout, user } = useAuth();

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
    logout();
    navigate('/login');
  };

  const getInitials = (email?: string) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  const visibleMenuItems = menuItems.filter((item) => item.id !== 'menu-history' || isAuthenticated);

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      {/* Menu mobile + Logo e Nome */}
      <div className="flex items-center gap-2 sm:gap-4">
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu de navegação</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SheetHeader className="border-b px-6 py-4">
                <SheetTitle>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-base leading-none">{APP_NAME}</p>
                      <p className="text-xs text-muted-foreground leading-none mt-1">{APP_DOMAIN}</p>
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <nav className="px-4 py-4 space-y-1">
                {visibleMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.url || (item.url !== '/' && location.pathname.startsWith(item.url));

                  return (
                    <Link
                      key={`mobile-${item.id}`}
                      id={item.id}
                      to={item.url}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
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
            </SheetContent>
          </Sheet>
        )}

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
      <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
        {visibleMenuItems.map((item) => {
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
            <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:inline-flex" onClick={toggleFullscreen}>
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

        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-accent transition-colors pr-4"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">{user.username}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user.username}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 dark:text-red-500 cursor-pointer" onClick={handleLogout}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigate('/login');
            }}
          >
            Entrar
          </Button>
        )}
      </div>
    </header>
  );
}
