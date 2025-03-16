
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
                          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
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
              <CheckCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium">Nenhum treino cadastrado</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-4">
              Cadastre seus treinos para poder acompanhá-los e agendá-los.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkoutList;
