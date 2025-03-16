
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Plus, 
  Trash2,
  Dumbbell
} from 'lucide-react';
import { Exercise, Workout } from '@/lib/types';

interface WorkoutFormProps {
  onSave: (workout: Omit<Workout, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<Omit<Exercise, 'id'>[]>([
    { name: '', sets: 3, reps: 10, weight: 0 }
  ]);

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 3, reps: 10, weight: 0 }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof Omit<Exercise, 'id'>, value: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value
    };
    setExercises(updatedExercises);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if workout name is provided
    if (!name.trim()) {
      alert('Por favor, forneça um nome para o treino');
      return;
    }
    
    // Check if all exercises have names
    if (exercises.some(ex => !ex.name.trim())) {
      alert('Por favor, nomeie todos os exercícios');
      return;
    }
    
    // Create the new workout
    const newWorkout = {
      name,
      description,
      exercises: exercises as Exercise[],
    };
    
    onSave(newWorkout);
  };

  return (
    <Card className="w-full shadow-md">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Dumbbell className="mr-2 h-5 w-5 text-primary" />
            Novo treino
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="workout-name">Nome do treino</Label>
            <Input
              id="workout-name"
              placeholder="Ex: Treino de Peito e Tríceps"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workout-description">Descrição (opcional)</Label>
            <Textarea
              id="workout-description"
              placeholder="Adicione notas ou detalhes sobre este treino"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Exercícios</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExercise}
                className="flex items-center text-xs h-8"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Adicionar exercício
              </Button>
            </div>
            
            {exercises.map((exercise, index) => (
              <div 
                key={index} 
                className="space-y-3 p-4 border rounded-md bg-secondary/30 animate-fadeIn"
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor={`exercise-name-${index}`} className="text-sm font-medium">
                    Exercício {index + 1}
                  </Label>
                  {exercises.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExercise(index)}
                      className="h-8 px-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Input
                      id={`exercise-name-${index}`}
                      placeholder="Nome do exercício"
                      value={exercise.name}
                      onChange={(e) => updateExercise(index, 'name', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor={`exercise-sets-${index}`} className="text-xs">
                        Séries
                      </Label>
                      <Input
                        id={`exercise-sets-${index}`}
                        type="number"
                        min="1"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor={`exercise-reps-${index}`} className="text-xs">
                        Repetições
                      </Label>
                      <Input
                        id={`exercise-reps-${index}`}
                        type="number"
                        min="1"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor={`exercise-weight-${index}`} className="text-xs">
                        Peso (kg)
                      </Label>
                      <Input
                        id={`exercise-weight-${index}`}
                        type="number"
                        min="0"
                        step="0.5"
                        value={exercise.weight}
                        onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Salvar treino
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default WorkoutForm;
