import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Edit, CalendarIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import WorkoutForm from '@/components/WorkoutForm';
import WorkoutList from '@/components/WorkoutList';
import { Workout, ScheduledWorkout, Exercise } from '@/lib/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Workouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date>(new Date());
  const [workoutToSchedule, setWorkoutToSchedule] = useState<string | null>(null);

  useEffect(() => {
    const savedWorkouts = localStorage.getItem('workouts');
    const savedSchedules = localStorage.getItem('scheduledWorkouts');
    
    if (savedWorkouts) {
      try {
        const parsedWorkouts = JSON.parse(savedWorkouts);
        const formattedWorkouts = parsedWorkouts.map((w: any) => ({
          ...w,
          createdAt: new Date(w.createdAt)
        }));
        setWorkouts(formattedWorkouts);
      } catch (e) {
        console.error('Error parsing workouts:', e);
      }
    } else {
      createSampleData();
    }
    
    if (savedSchedules) {
      try {
        const parsedSchedules = JSON.parse(savedSchedules);
        const formattedSchedules = parsedSchedules.map((s: any) => ({
          ...s,
          date: new Date(s.date),
          workout: {
            ...s.workout,
            createdAt: new Date(s.workout.createdAt)
          }
        }));
        setScheduledWorkouts(formattedSchedules);
      } catch (e) {
        console.error('Error parsing scheduled workouts:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);
  
  useEffect(() => {
    localStorage.setItem('scheduledWorkouts', JSON.stringify(scheduledWorkouts));
  }, [scheduledWorkouts]);

  const createSampleData = () => {
    const sampleWorkouts: Workout[] = [
      {
        id: uuidv4(),
        name: 'Treino de Peito e Tríceps',
        description: 'Foco em hipertrofia com cargas moderadas',
        exercises: [
          { id: uuidv4(), name: 'Supino Reto', sets: 4, reps: 12, weight: 60 },
          { id: uuidv4(), name: 'Crucifixo', sets: 3, reps: 15, weight: 14 },
          { id: uuidv4(), name: 'Supino Inclinado', sets: 3, reps: 12, weight: 50 },
          { id: uuidv4(), name: 'Tríceps Corda', sets: 4, reps: 12, weight: 25 },
          { id: uuidv4(), name: 'Tríceps Francês', sets: 3, reps: 12, weight: 15 },
        ],
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Treino de Costas e Bíceps',
        description: 'Foco em largura e espessura',
        exercises: [
          { id: uuidv4(), name: 'Puxada Frente', sets: 4, reps: 12, weight: 70 },
          { id: uuidv4(), name: 'Remada Curvada', sets: 3, reps: 12, weight: 50 },
          { id: uuidv4(), name: 'Remada Unilateral', sets: 3, reps: 12, weight: 20 },
          { id: uuidv4(), name: 'Rosca Direta', sets: 3, reps: 12, weight: 25 },
          { id: uuidv4(), name: 'Rosca Martelo', sets: 3, reps: 12, weight: 14 },
        ],
        createdAt: new Date(),
      },
    ];
    
    setWorkouts(sampleWorkouts);
    
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const sampleSchedules: ScheduledWorkout[] = [
      {
        id: uuidv4(),
        workout: sampleWorkouts[0],
        date: today,
        completed: false,
      },
      {
        id: uuidv4(),
        workout: sampleWorkouts[1],
        date: tomorrow,
        completed: false,
      },
    ];
    
    setScheduledWorkouts(sampleSchedules);
  };

  const handleSaveWorkout = (workoutData: Omit<Workout, 'id' | 'createdAt'>) => {
    const exercisesWithIds = workoutData.exercises.map(exercise => ({
      ...exercise,
      id: uuidv4()
    }));
    
    if (editingWorkout) {
      const updatedWorkouts = workouts.map(workout => 
        workout.id === editingWorkout 
          ? { 
              ...workout, 
              name: workoutData.name, 
              description: workoutData.description, 
              exercises: exercisesWithIds,
            } 
          : workout
      );
      
      setWorkouts(updatedWorkouts);
      toast.success('Treino atualizado com sucesso!');
    } else {
      const newWorkout: Workout = {
        id: uuidv4(),
        name: workoutData.name,
        description: workoutData.description,
        exercises: exercisesWithIds,
        createdAt: new Date(),
      };
      
      setWorkouts([...workouts, newWorkout]);
      toast.success('Treino criado com sucesso!');
    }
    
    setShowForm(false);
    setEditingWorkout(null);
  };

  const handleEditWorkout = (id: string) => {
    setEditingWorkout(id);
    setShowForm(true);
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(workout => workout.id !== id));
    setScheduledWorkouts(scheduledWorkouts.filter(
      scheduledWorkout => scheduledWorkout.workout.id !== id
    ));
    
    toast.success('Treino excluído com sucesso!');
  };

  const handleViewWorkout = (id: string) => {
    const workout = workouts.find(w => w.id === id);
    if (workout) {
      setSelectedWorkout(workout);
    }
  };

  const handleScheduleWorkout = (workoutId: string) => {
    setWorkoutToSchedule(workoutId);
    setShowScheduleDialog(true);
  };

  const confirmScheduleWorkout = () => {
    if (!workoutToSchedule) return;
    
    const workout = workouts.find(w => w.id === workoutToSchedule);
    if (!workout) return;
    
    const newSchedule: ScheduledWorkout = {
      id: uuidv4(),
      workout,
      date: scheduleDate,
      completed: false,
    };
    
    setScheduledWorkouts([...scheduledWorkouts, newSchedule]);
    setShowScheduleDialog(false);
    setWorkoutToSchedule(null);
    
    toast.success(`Treino agendado para ${format(scheduleDate, 'dd/MM/yyyy')}`);
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <div className="md:pl-64 pt-16 md:pt-0">
        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Treinos</h1>
              <p className="text-muted-foreground mt-1">
                Crie e agende seus treinos de forma organizada
              </p>
            </div>
            <Button onClick={() => {
              setEditingWorkout(null);
              setShowForm(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo treino
            </Button>
          </div>
          
          <Tabs defaultValue="list" className="space-y-6">
            <TabsList>
              <TabsTrigger value="list">Treinos e agenda</TabsTrigger>
              {showForm && <TabsTrigger value="form">Novo treino</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="list" className="space-y-6">
              <WorkoutList 
                workouts={workouts}
                scheduledWorkouts={scheduledWorkouts}
                onEditWorkout={handleEditWorkout}
                onDeleteWorkout={handleDeleteWorkout}
                onScheduleWorkout={handleScheduleWorkout}
                onViewWorkout={handleViewWorkout}
              />
            </TabsContent>
            
            <TabsContent value="form">
              {showForm && (
                <WorkoutForm 
                  onSave={handleSaveWorkout}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingWorkout(null);
                  }}
                />
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <Dialog open={!!selectedWorkout} onOpenChange={(open) => !open && setSelectedWorkout(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedWorkout?.name}</DialogTitle>
            <DialogDescription>
              {selectedWorkout?.description || 'Detalhes do treino'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Exercícios</h3>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exercício</TableHead>
                    <TableHead className="w-16 text-center">Séries</TableHead>
                    <TableHead className="w-16 text-center">Reps</TableHead>
                    <TableHead className="w-20 text-right">Peso (kg)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedWorkout?.exercises.map((exercise) => (
                    <TableRow key={exercise.id}>
                      <TableCell>{exercise.name}</TableCell>
                      <TableCell className="text-center">{exercise.sets}</TableCell>
                      <TableCell className="text-center">{exercise.reps}</TableCell>
                      <TableCell className="text-right">{exercise.weight}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                if (selectedWorkout) {
                  handleEditWorkout(selectedWorkout.id);
                  setSelectedWorkout(null);
                }
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button
              onClick={() => {
                if (selectedWorkout) {
                  handleScheduleWorkout(selectedWorkout.id);
                  setSelectedWorkout(null);
                }
              }}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Agendar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agendar treino</DialogTitle>
            <DialogDescription>
              Selecione uma data para agendar seu treino
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 flex flex-col items-center space-y-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !scheduleDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduleDate ? format(scheduleDate, "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={scheduleDate}
                  onSelect={(date) => date && setScheduleDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <div className="flex space-x-3 w-full">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowScheduleDialog(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1"
                onClick={confirmScheduleWorkout}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Workouts;
