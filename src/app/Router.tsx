import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from '@/features/home/Landing';
import { Home } from '@/features/home/Home';
import { Splits } from '@/features/splits/Splits';
import { WorkoutDay } from '@/features/workout/WorkoutDay';
import { ExerciseDetails } from '@/features/exercise/ExerciseDetails';
import { WorkoutComplete } from '@/features/workout/WorkoutComplete';
import { Dashboard } from '@/features/dashboard/Dashboard';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/splits" element={<Splits />} />
        <Route path="/ppl/:dayId" element={<WorkoutDay />} />
        <Route path="/exercise/:id" element={<ExerciseDetails />} />
        <Route path="/workout-complete" element={<WorkoutComplete />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
