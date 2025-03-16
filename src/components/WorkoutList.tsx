
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScheduledWorkout, Workout } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MoreHorizontal,
  Calendar,
  Edit,
  Trash2,
  Eye,
  CheckSquare,
  CheckCircle,
  Circle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface WorkoutListProps {
  workouts: Workout[];
  scheduledWorkouts: ScheduledWorkout[];
  onEditWorkout: (id: string) => void;
  onDeleteWorkout: (id: string) => void;
  onScheduleWorkout: (id: string) => void;
  onViewWorkout: (id: string) => void;
  onToggleCompletion: (id: string) => void;
}

const WorkoutList: React.FC<WorkoutListProps> = ({
  workouts,
  scheduledWorkouts,
  onEditWorkout,
  onDeleteWorkout,
  onScheduleWorkout,
  onViewWorkout,
  onToggleCompletion
}) => {
  const sortedScheduledWorkouts = [...scheduledWorkouts].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  const upcomingWorkouts = sortedScheduledWorkouts.filter(
    (sw) => new Date(sw.date) >= new Date(new Date().setHours(0, 0, 0, 0))
  );

  const pastWorkouts = sortedScheduledWorkouts.filter(
    (sw) => new Date(sw.date) < new Date(new Date().setHours(0, 0, 0, 0))
  );

  return (
    <Tabs defaultValue="workouts" className="space-y-4">
      <TabsList>
        <TabsTrigger value="workouts">Meus treinos</TabsTrigger>
        <TabsTrigger value="scheduled">Agenda</TabsTrigger>
      </TabsList>

      <TabsContent value="workouts">
        <Card>
          <CardHeader>
            <CardTitle>Treinos salvos</CardTitle>
            <CardDescription>Visualize e gerencie seus treinos</CardDescription>
          </CardHeader>
          <CardContent>
            {workouts.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Exercícios</TableHead>
                      <TableHead className="hidden md:table-cell">Criado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workouts.map((workout) => (
                      <TableRow key={workout.id}>
                        <TableCell className="font-medium">{workout.name}</TableCell>
                        <TableCell>{workout.exercises.length} exercícios</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {format(new Date(workout.createdAt), 'dd/MM/yyyy', {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => onViewWorkout(workout.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onEditWorkout(workout.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onScheduleWorkout(workout.id)}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Agendar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => onDeleteWorkout(workout.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-12">
                <div className="bg-muted rounded-full p-3 mb-4">
                  <CheckSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium">Nenhum treino cadastrado</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-4">
                  Cadastre seus treinos para poder acompanhá-los e agendá-los.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="scheduled">
        <Card>
          <CardHeader>
            <CardTitle>Agenda de treinos</CardTitle>
            <CardDescription>Visualize e gerencie seus treinos agendados</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="space-y-4">
              <TabsList>
                <TabsTrigger value="upcoming">Próximos</TabsTrigger>
                <TabsTrigger value="past">Anteriores</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                {upcomingWorkouts.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10"></TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Treino</TableHead>
                          <TableHead className="hidden md:table-cell">Exercícios</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingWorkouts.map((scheduledWorkout) => (
                          <TableRow key={scheduledWorkout.id}>
                            <TableCell>
                              <Checkbox 
                                checked={scheduledWorkout.completed}
                                onCheckedChange={() => onToggleCompletion(scheduledWorkout.id)}
                              />
                            </TableCell>
                            <TableCell>
                              {format(new Date(scheduledWorkout.date), 'dd/MM/yyyy', {
                                locale: ptBR,
                              })}
                              {new Date(scheduledWorkout.date).toDateString() ===
                                new Date().toDateString() && (
                                <Badge variant="outline" className="ml-2">
                                  Hoje
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              {scheduledWorkout.workout.name}
                              {scheduledWorkout.completed && (
                                <Badge className="ml-2 bg-green-500 hover:bg-green-600">
                                  Concluído
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {scheduledWorkout.workout.exercises.length} exercícios
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => onViewWorkout(scheduledWorkout.workout.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Visualizar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onToggleCompletion(scheduledWorkout.id)}>
                                    {scheduledWorkout.completed ? (
                                      <>
                                        <Circle className="mr-2 h-4 w-4" />
                                        Marcar como não concluído
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Marcar como concluído
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onScheduleWorkout(scheduledWorkout.workout.id)}>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Reagendar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => onDeleteWorkout(scheduledWorkout.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center py-12">
                    <div className="bg-muted rounded-full p-3 mb-4">
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium">Nenhum treino agendado</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-4">
                      Agende seus treinos para acompanhar seu progresso.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past">
                {pastWorkouts.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10"></TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Treino</TableHead>
                          <TableHead className="hidden md:table-cell">Exercícios</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastWorkouts.map((scheduledWorkout) => (
                          <TableRow key={scheduledWorkout.id}>
                            <TableCell>
                              <Checkbox 
                                checked={scheduledWorkout.completed}
                                onCheckedChange={() => onToggleCompletion(scheduledWorkout.id)}
                              />
                            </TableCell>
                            <TableCell>
                              {format(new Date(scheduledWorkout.date), 'dd/MM/yyyy', {
                                locale: ptBR,
                              })}
                            </TableCell>
                            <TableCell className="font-medium">
                              {scheduledWorkout.workout.name}
                              {scheduledWorkout.completed && (
                                <Badge className="ml-2 bg-green-500 hover:bg-green-600">
                                  Concluído
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {scheduledWorkout.workout.exercises.length} exercícios
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => onViewWorkout(scheduledWorkout.workout.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Visualizar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onToggleCompletion(scheduledWorkout.id)}>
                                    {scheduledWorkout.completed ? (
                                      <>
                                        <Circle className="mr-2 h-4 w-4" />
                                        Marcar como não concluído
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Marcar como concluído
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onScheduleWorkout(scheduledWorkout.workout.id)}>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Reagendar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => onDeleteWorkout(scheduledWorkout.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center py-12">
                    <div className="bg-muted rounded-full p-3 mb-4">
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium">Nenhum treino passado</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-4">
                      Seus treinos anteriores aparecerão aqui.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default WorkoutList;
