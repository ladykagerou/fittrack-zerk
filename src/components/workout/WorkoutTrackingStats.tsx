
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScheduledWorkout } from '@/lib/types';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { Calendar, Activity, TrendingUp, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkoutTrackingStatsProps {
  scheduledWorkouts: ScheduledWorkout[];
}

const WorkoutTrackingStats: React.FC<WorkoutTrackingStatsProps> = ({
  scheduledWorkouts,
}) => {
  // Get current week's workouts
  const currentDate = new Date();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  
  const thisWeekWorkouts = scheduledWorkouts.filter(
    workout => isWithinInterval(workout.date, { start: weekStart, end: weekEnd })
  );
  
  const completedWorkouts = scheduledWorkouts.filter(workout => workout.completed).length;
  const totalWorkouts = scheduledWorkouts.length;
  const completionRate = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;
  
  const thisWeekTotal = thisWeekWorkouts.length;
  const thisWeekCompleted = thisWeekWorkouts.filter(workout => workout.completed).length;
  const thisWeekProgress = thisWeekTotal > 0 ? Math.round((thisWeekCompleted / thisWeekTotal) * 100) : 0;
  
  // Count streak (consecutive completed workouts from most recent)
  const sortedCompletedWorkouts = [...scheduledWorkouts]
    .filter(workout => workout.completed)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Calculate longest workout streak
  let currentStreak = 0;
  let longestStreak = 0;
  
  if (sortedCompletedWorkouts.length > 0) {
    currentStreak = 1;
    let prevDate = sortedCompletedWorkouts[0].date;
    
    for (let i = 1; i < sortedCompletedWorkouts.length; i++) {
      const currentDate = sortedCompletedWorkouts[i].date;
      const diffTime = Math.abs(prevDate.getTime() - currentDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 2) { // Allow 1 day gap for rest days
        currentStreak++;
      } else {
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
        currentStreak = 1;
      }
      prevDate = currentDate;
    }
    
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-primary" />
            Treinos agendados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{scheduledWorkouts.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {completedWorkouts} treinos concluídos
          </p>
          <div className="mt-2">
            <Progress value={completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <Activity className="mr-2 h-4 w-4 text-primary" />
            Progresso semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{thisWeekCompleted}/{thisWeekTotal}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {format(weekStart, 'dd/MM')} - {format(weekEnd, 'dd/MM')}
          </p>
          <div className="mt-2">
            <Progress value={thisWeekProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <TrendingUp className="mr-2 h-4 w-4 text-primary" />
            Taxa de conclusão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Média de treinos concluídos
          </p>
          <div className="mt-2">
            <Progress 
              value={completionRate} 
              className={cn("h-2", {
                "bg-red-200": completionRate < 30,
                "bg-yellow-200": completionRate >= 30 && completionRate < 70,
                "bg-green-200": completionRate >= 70,
              })}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <Award className="mr-2 h-4 w-4 text-primary" />
            Sequência de treinos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentStreak}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Recorde: {longestStreak} treinos
          </p>
          <div className="mt-2">
            <Progress value={(currentStreak / Math.max(longestStreak, 5)) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutTrackingStats;
