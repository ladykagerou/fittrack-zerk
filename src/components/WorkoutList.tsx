
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  CalendarDays, 
  CheckCircle2, 
  ChevronRight, 
  Copy, 
  Dumbbell, 
  Edit, 
  MoreHorizontal, 
  Pencil, 
  Repeat, 
  Trash2, 
  Weight 
} from 'lucide-react';
import { Workout, ScheduledWorkout } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface WorkoutListProps {
  workouts: Workout[];
  scheduledWorkouts: ScheduledWorkout[];
  onEditWorkout: (id: string) => void;
  onDeleteWorkout: (id: string) => void;
  onScheduleWorkout: (workoutId: string) => void;
  onViewWorkout: (id: string) => void;
}

const WorkoutList: React.FC<WorkoutListProps> = ({
  workouts,
  scheduledWorkouts,
  onEditWorkout,
  onDeleteWorkout,
  onScheduleWorkout,
  onViewWorkout,
}) => {
  // Group scheduled workouts by date
  const groupedSchedules = scheduledWorkouts.reduce((acc, schedule) => {
    const dateKey = format(schedule.date, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(schedule);
    return acc;
  }, {} as Record<string, ScheduledWorkout[]>);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Scheduled Workouts */}
      <div>
        <div className="flex items-center mb-4">
          <CalendarDays className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-semibold">Agenda de treinos</h2>
        </div>
        
        {Object.keys(groupedSchedules).length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groupedSchedules)
              .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
              .map(([dateKey, schedules]) => {
                const date = new Date(dateKey);
                const formattedDate = format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
                
                return (
                  <Card key={dateKey} className="hover-lift">
                    <CardHeader className="pb-2">
                      <Badge variant="outline" className="w-fit capitalize">
                        {format(date, "EEEE", { locale: ptBR })}
                      </Badge>
                      <CardTitle className="text-base">
                        {formattedDate}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {schedules.map((schedule) => (
                          <div 
                            key={schedule.id} 
                            className={cn(
                              "flex items-center p-2 rounded-md",
                              schedule.completed ? "bg-green-50 border border-green-100" : "bg-secondary/50"
                            )}
                          >
                            <div className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center mr-3",
                              schedule.completed ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"
                            )}>
                              {schedule.completed ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <Dumbbell className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium">{schedule.workout.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {schedule.workout.exercises.length} exercícios
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onViewWorkout(schedule.workout.id)}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        ) : (
          <Card className="bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
              <div className="rounded-full bg-muted p-3 mb-4">
                <CalendarDays className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-center mb-4">
                Nenhum treino agendado
              </p>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Agende um treino da lista de treinos abaixo
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Workouts List */}
      <div>
        <div className="flex items-center mb-4">
          <Dumbbell className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-semibold">Meus treinos</h2>
        </div>
        
        {workouts.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {workouts.map((workout) => (
              <Card key={workout.id} className="hover-lift">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{workout.name}</CardTitle>
                      <CardDescription>
                        {workout.exercises.length} exercícios
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onScheduleWorkout(workout.id)}>
                          <CalendarDays className="mr-2 h-4 w-4" />
                          <span>Agendar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditWorkout(workout.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteWorkout(workout.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {workout.exercises.slice(0, 3).map((exercise, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <ChevronRight className="h-3 w-3 mr-1 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 truncate">{exercise.name}</div>
                        <div className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {exercise.sets}×{exercise.reps}
                        </div>
                      </div>
                    ))}
                    {workout.exercises.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        + {workout.exercises.length - 3} mais exercícios
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground"
                    onClick={() => onScheduleWorkout(workout.id)}
                  >
                    <Repeat className="mr-1 h-3 w-3" />
                    Recorrente
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewWorkout(workout.id)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Dumbbell className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-center mb-4">
                Nenhum treino criado
              </p>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Crie seu primeiro treino para começar
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkoutList;
