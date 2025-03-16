
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScheduledWorkout } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, CircleX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkoutCalendarProps {
  scheduledWorkouts: ScheduledWorkout[];
  onToggleCompletion: (id: string) => void;
}

const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({
  scheduledWorkouts,
  onToggleCompletion,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get workouts for the selected date
  const selectedDateWorkouts = scheduledWorkouts.filter(
    (workout) => selectedDate && isSameDay(workout.date, selectedDate)
  );

  // Function to determine if a day has workouts scheduled
  const getDayClassNames = (date: Date, scheduledWorkouts: ScheduledWorkout[]) => {
    const hasWorkout = scheduledWorkouts.some((workout) => isSameDay(workout.date, date));
    
    if (!hasWorkout) return '';
    
    const allCompleted = scheduledWorkouts
      .filter((workout) => isSameDay(workout.date, date))
      .every((workout) => workout.completed);
    
    if (allCompleted) return 'bg-green-100 text-green-800 font-medium';
    return 'bg-blue-100 text-blue-800 font-medium';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendário de Treinos</CardTitle>
        <CardDescription>
          Clique em um dia para ver e gerenciar seus treinos
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={ptBR}
            className="rounded-md border pointer-events-auto"
            modifiersClassNames={{
              today: 'bg-primary/10 text-primary font-medium',
            }}
            components={{
              DayContent: ({ date, ...props }) => (
                <div
                  className={cn(
                    "w-full h-full flex items-center justify-center",
                    getDayClassNames(date, scheduledWorkouts)
                  )}
                  {...props}
                >
                  {date.getDate()}
                </div>
              ),
            }}
          />
        </div>
        
        <div className="flex-1">
          {selectedDate ? (
            <>
              <h3 className="font-medium text-lg mb-4">
                Treinos para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </h3>
              
              {selectedDateWorkouts.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateWorkouts.map((scheduledWorkout) => (
                    <div 
                      key={scheduledWorkout.id} 
                      className={cn(
                        "p-4 rounded-lg border flex justify-between items-center cursor-pointer transition-colors",
                        scheduledWorkout.completed 
                          ? "bg-green-50 border-green-200" 
                          : "bg-white hover:bg-gray-50"
                      )}
                      onClick={() => onToggleCompletion(scheduledWorkout.id)}
                    >
                      <div>
                        <h4 className="font-medium">{scheduledWorkout.workout.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {scheduledWorkout.workout.exercises.length} exercícios
                        </p>
                      </div>
                      
                      <div>
                        {scheduledWorkout.completed ? (
                          <Badge className="flex items-center bg-green-500 hover:bg-green-600">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Concluído
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center">
                            <CircleX className="mr-1 h-3 w-3" />
                            Pendente
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border rounded-lg bg-gray-50">
                  <p className="text-muted-foreground">
                    Nenhum treino agendado para este dia
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground">
                Selecione uma data para ver os treinos
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutCalendar;
