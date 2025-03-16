
import React from 'react';
import { Edit, CalendarIcon } from 'lucide-react';
import { Workout } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';

interface WorkoutDetailDialogProps {
  workout: Workout | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (id: string) => void;
  onSchedule: (id: string) => void;
}

const WorkoutDetailDialog: React.FC<WorkoutDetailDialogProps> = ({
  workout,
  onOpenChange,
  onEdit,
  onSchedule,
}) => {
  if (!workout) return null;

  return (
    <Dialog open={!!workout} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{workout.name}</DialogTitle>
          <DialogDescription>
            {workout.description || 'Detalhes do treino'}
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
                {workout.exercises.map((exercise) => (
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
              onEdit(workout.id);
              onOpenChange(false);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            onClick={() => {
              onSchedule(workout.id);
              onOpenChange(false);
            }}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Agendar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutDetailDialog;
