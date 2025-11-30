import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginPayload, RegisterPayload } from '~/apis';
import { accountApi } from '~/apis';
import background from '~/assets/images/background-login.jpg';
import { useAuth } from '~/contexts/AuthContext';

export function LoginPage() {
  const [form, setForm] = useState<LoginPayload>({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState<RegisterPayload>({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleChange = (field: keyof LoginPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleRegisterChange = (field: keyof RegisterPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast({
        title: 'Login realizado com sucesso',
        description: 'Você já pode utilizar a calculadora com histórico.',
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Erro ao realizar login',
        description: error?.detail || 'Não foi possível autenticar. Verifique seu usuário e senha e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await accountApi.register(registerForm);
      toast({
        title: 'Conta criada com sucesso',
        description: 'Você já pode acessar a plataforma. Fazendo login automaticamente...',
      });

      await login({ email: registerForm.email, password: registerForm.password });
      navigate('/');
    } catch (error: any) {
      const detail =
        error?.detail ||
        (typeof error === 'object'
          ? Object.values(error as Record<string, string[] | string>)[0]?.toString()
          : undefined);

      toast({
        title: 'Erro ao registrar',
        description:
          detail ||
          'Não foi possível criar sua conta. Verifique os dados informados (usuário único, email válido, senha mínima) e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
      <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden shadow-lg bg-card">
        <div className="hidden md:block relative">
          <img src={background} alt="Login" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-2xl font-bold">Bem-vindo ao Curupira</h2>
            <p className="text-sm text-white/80 mt-1">
              Faça login para salvar e acompanhar o histórico de emissões calculadas.
            </p>
          </div>
        </div>

        <div className="p-8 flex flex-col justify-center">
          <h1 className="text-2xl font-bold mb-2">{isRegisterMode ? 'Criar conta' : 'Entrar'}</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {isRegisterMode
              ? 'Preencha os dados abaixo para criar sua conta na plataforma.'
              : 'Utilize seu e-mail e senha cadastrados para acessar o sistema.'}
          </p>

          {isRegisterMode ? (
            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
              <div className="space-y-2">
                <Label htmlFor="register-username">Usuário</Label>
                <Input
                  id="register-username"
                  value={registerForm.username}
                  onChange={handleRegisterChange('username')}
                  placeholder="Escolha um nome de usuário"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">E-mail</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange('email')}
                  placeholder="seuemail@exemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Senha</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange('password')}
                  placeholder="Mínimo de 6 caracteres"
                  required
                />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="Digite sua senha"
                  required
                />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          )}

          <button
            type="button"
            className="mt-4 text-sm text-primary hover:underline text-left"
            onClick={() => setIsRegisterMode((prev) => !prev)}
          >
            {isRegisterMode
              ? 'Já tem uma conta? Clique aqui para entrar.'
              : 'Ainda não possui conta? Clique aqui para se registrar.'}
          </button>
        </div>
      </div>
    </div>
  );
}
