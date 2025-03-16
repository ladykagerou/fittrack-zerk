
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Workout, ScheduledWorkout, Exercise } from '@/lib/types';

export const useWorkouts = () => {
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

  return {
    workouts,
    scheduledWorkouts,
    showForm,
    setShowForm,
    editingWorkout,
    setEditingWorkout,
    selectedWorkout,
    setSelectedWorkout,
    showScheduleDialog,
    setShowScheduleDialog,
    scheduleDate,
    setScheduleDate,
    workoutToSchedule,
    handleSaveWorkout,
    handleEditWorkout,
    handleDeleteWorkout,
    handleViewWorkout,
    handleScheduleWorkout,
    confirmScheduleWorkout
  };
};
