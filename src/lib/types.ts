
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  createdAt: Date;
}

export interface ScheduledWorkout {
  id: string;
  workout: Workout;
  date: Date;
  completed: boolean;
}

export interface WeightRecord {
  id: string;
  weight: number;
  date: Date;
  notes?: string;
}

export interface CalorieCalculation {
  id: string;
  date: Date;
  gender: 'male' | 'female';
  age: number;
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
  bmr: number;
  tdee: number;
  targetCalories: number;
}
