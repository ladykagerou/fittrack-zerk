
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const Login = () => {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Em um cenário real, isso seria uma chamada para uma API
    // que verificaria as credenciais
    if (loginEmail && loginPassword) {
      // Simular login bem-sucedido
      const user: User = {
        id: '1',
        username: loginEmail.split('@')[0],
        email: loginEmail,
      };
      
      // Salvar no localStorage para simular um token de sessão
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } else {
      toast.error('Por favor, preencha todos os campos!');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificações básicas
    if (!registerUsername || !registerEmail || !registerPassword || !confirmPassword) {
      toast.error('Por favor, preencha todos os campos!');
      return;
    }
    
    if (registerPassword !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }
    
    // Em um cenário real, isso enviaria os dados para uma API
    // que registraria o novo usuário no banco de dados
    
    // Simular registro bem-sucedido
    const newUser: User = {
      id: uuidv4(),
      username: registerUsername,
      email: registerEmail,
    };
    
    // Salvar no localStorage para simular um token de sessão
    localStorage.setItem('user', JSON.stringify(newUser));
    
    toast.success('Registro realizado com sucesso!');
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen bg-secondary/30 items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-primary/10 p-2 rounded-full mb-4">
            <Dumbbell className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">FitTrack</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe seus treinos e progresso físico
          </p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Bem-vindo de volta
            </CardTitle>
            <CardDescription className="text-center">
              Entre ou crie uma conta para começar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Registro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Entrar
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Nome de usuário</Label>
                      <Input 
                        id="username" 
                        placeholder="seunome" 
                        value={registerUsername}
                        onChange={(e) => setRegisterUsername(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">E-mail</Label>
                      <Input 
                        id="register-email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <Input 
                        id="register-password" 
                        type="password" 
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar senha</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Criar conta
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
