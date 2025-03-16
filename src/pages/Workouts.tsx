
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import WorkoutForm from '@/components/WorkoutForm';
import WorkoutList from '@/components/WorkoutList';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useWorkouts } from '@/hooks/useWorkouts';
import ScheduleWorkoutDialog from '@/components/workout/ScheduleWorkoutDialog';
import WorkoutDetailDialog from '@/components/workout/WorkoutDetailDialog';
import WorkoutTrackingStats from '@/components/workout/WorkoutTrackingStats';
import WorkoutCalendar from '@/components/workout/WorkoutCalendar';

const Workouts = () => {
  const {
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
    handleSaveWorkout,
    handleEditWorkout,
    handleDeleteWorkout,
    handleViewWorkout,
    handleScheduleWorkout,
    confirmScheduleWorkout,
    toggleWorkoutCompletion
  } = useWorkouts();

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
          
          {/* Workout Calendar - New Primary Component */}
          <div className="mb-8">
            <WorkoutCalendar 
              scheduledWorkouts={scheduledWorkouts}
              onToggleCompletion={toggleWorkoutCompletion}
            />
          </div>
          
          {/* Add Workout Stats */}
          {scheduledWorkouts.length > 0 && (
            <div className="mb-8">
              <WorkoutTrackingStats scheduledWorkouts={scheduledWorkouts} />
            </div>
          )}
          
          <Tabs defaultValue="list" className="space-y-6">
            <TabsList>
              <TabsTrigger value="list">Meus Treinos</TabsTrigger>
              {showForm && <TabsTrigger value="form">Novo treino</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="list" className="space-y-6">
              <WorkoutList 
                workouts={workouts}
                scheduledWorkouts={[]} // No need to show scheduled workouts in list anymore
                onEditWorkout={handleEditWorkout}
                onDeleteWorkout={handleDeleteWorkout}
                onScheduleWorkout={handleScheduleWorkout}
                onViewWorkout={handleViewWorkout}
                onToggleCompletion={toggleWorkoutCompletion}
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
      
      {/* Detail and Schedule Dialogs */}
      <WorkoutDetailDialog 
        workout={selectedWorkout}
        onOpenChange={(open) => !open && setSelectedWorkout(null)}
        onEdit={handleEditWorkout}
        onSchedule={handleScheduleWorkout}
      />
      
      <ScheduleWorkoutDialog 
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        date={scheduleDate}
        onDateChange={(date) => date && setScheduleDate(date)}
        onConfirm={confirmScheduleWorkout}
      />
    </div>
  );
};

export default Workouts;
