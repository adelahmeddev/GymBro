export interface User {
  id: string;
  fullName: string;
  createdAt: number;
  lastActiveAt: number;
}

export interface Split {
  id: string;
  nameKey: string;
  descriptionKey: string;
  enabled: boolean;
  days: string[];
  icon?: string;
}

export interface WorkoutDay {
  id: string;
  splitId: string;
  nameKey: string;
  descriptionKey: string;
  estimatedDuration: number;
  targetMuscles: string[];
  exerciseIds: string[];
  dayOrder: number;
}

export interface Exercise {
  id: string;
  nameKey: string;
  gifPath?: string;
  videoUrl?: string;
  posterUrl?: string;
  primaryMuscleKey: string;
  secondaryMusclesKey: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  sets: number;
  reps: string;
  restTime: string;
  technique: TechniqueSection;
  commonMistakes: string[];
  coachTips: string[];
}

export interface TechniqueSection {
  setup: string[];
  execution: string[];
  breathing: string[];
  rangeOfMotion: string[];
}

export interface WeightLog {
  exerciseId: string;
  date: string;
  sets: WeightSet[];
}

export interface WeightSet {
  setNumber: number;
  weight: number;
  reps: number;
}

export interface WorkoutProgress {
  dayId: string;
  date: string;
  completedExercises: string[];
  startTime: number;
  endTime?: number;
  completed: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsersToday: number;
  totalVisits: number;
  mostActiveUsers: { name: string; count: number }[];
  workoutCompletionCount: number;
  mostViewedExercises: { name: string; views: number }[];
}

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Language = 'ar' | 'en';
