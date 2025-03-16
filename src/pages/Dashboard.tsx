import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Dumbbell, 
  Flame, 
  Trophy, 
  Weight 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const [workoutsCompleted, setWorkoutsCompleted] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [nextWorkout, setNextWorkout] = useState<any>(null);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    setWorkoutsCompleted(12);
    setWeeklyProgress(60);
    setNextWorkout({
      name: "Treino de Peito e Tríceps",
      time: "08:00",
      date: new Date(),
    });
  }, []);
  
  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <div className="md:pl-64 pt-16 md:pt-0">
        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Acompanhe seu progresso e gerencie seus treinos
              </p>
            </div>
            <div className="flex space-x-3">
              <Button asChild variant="default" size="sm" className="shadow-sm">
                <Link to="/workouts">
                  <Dumbbell className="mr-2 h-4 w-4" />
                  Novo treino
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="shadow-sm">
                <Link to="/weight">
                  <Weight className="mr-2 h-4 w-4" />
                  Registrar peso
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover-lift">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Treinos completados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-primary/10 p-2">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{workoutsCompleted}</div>
                    <p className="text-xs text-muted-foreground">
                      {workoutsCompleted > 10 ? "Bom trabalho!" : "Continue assim!"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover-lift">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Progresso semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-primary/10 p-2">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{weeklyProgress}%</span>
                        <span className="text-xs text-muted-foreground">3/5 dias</span>
                      </div>
                      <Progress value={weeklyProgress} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover-lift">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Último registro de peso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-primary/10 p-2">
                    <Weight className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">78 kg</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <span className="text-green-500 flex items-center mr-1">
                        -0.5 kg
                      </span>
                      desde a última semana
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Next Workout and Weekly Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Próximo treino</span>
                  {nextWorkout && (
                    <Badge variant="outline" className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      Hoje
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Seu próximo treino programado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {nextWorkout ? (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <Dumbbell className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{nextWorkout.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {nextWorkout.time}
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Exercícios</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center">
                          <ChevronRight className="h-3 w-3 mr-1 text-muted-foreground" />
                          Supino Reto • 4 séries • 12 reps
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-3 w-3 mr-1 text-muted-foreground" />
                          Crucifixo • 3 séries • 15 reps
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-3 w-3 mr-1 text-muted-foreground" />
                          Tríceps corda • 4 séries • 12 reps
                        </li>
                        <li className="flex items-center text-muted-foreground">
                          <ChevronRight className="h-3 w-3 mr-1" />
                          ... mais 2 exercícios
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="default" size="sm" asChild>
                        <Link to="/workouts">
                          Ver detalhes
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Nenhum treino programado para hoje
                    </p>
                    <Button variant="default" size="sm" asChild>
                      <Link to="/workouts">
                        Programar treino
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>Consumo calórico</CardTitle>
                <CardDescription>
                  Seu objetivo diário de calorias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Flame className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">2,450</h3>
                      <p className="text-sm text-muted-foreground">
                        calorias diárias
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Proteínas</span>
                      <span className="font-medium">180g</span>
                    </div>
                    <Progress value={75} className="h-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Carboidratos</span>
                      <span className="font-medium">220g</span>
                    </div>
                    <Progress value={60} className="h-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Gorduras</span>
                      <span className="font-medium">70g</span>
                    </div>
                    <Progress value={50} className="h-1" />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/calories">
                        Calcular calorias
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Weekly Schedule */}
          <Card className="hover-lift mb-8">
            <CardHeader>
              <CardTitle>Agenda semanal</CardTitle>
              <CardDescription>
                Seus treinos programados para a semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, index) => (
                  <div 
                    key={day} 
                    className={cn(
                      "border rounded-lg p-3 text-center transition-all",
                      index === 0 || index === 2 || index === 4 
                        ? "bg-primary/5 border-primary/20" 
                        : "bg-muted/30 border-muted/50"
                    )}
                  >
                    <div className="text-sm font-medium mb-2">{day}</div>
                    {index === 0 ? (
                      <div className="space-y-1">
                        <Badge className="bg-primary/10 text-primary border-primary/20 w-full">
                          Peito e Tríceps
                        </Badge>
                      </div>
                    ) : index === 2 ? (
                      <div className="space-y-1">
                        <Badge className="bg-primary/10 text-primary border-primary/20 w-full">
                          Costas e Bíceps
                        </Badge>
                      </div>
                    ) : index === 4 ? (
                      <div className="space-y-1">
                        <Badge className="bg-primary/10 text-primary border-primary/20 w-full">
                          Perna
                        </Badge>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground h-5 flex items-center justify-center">
                        -
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
