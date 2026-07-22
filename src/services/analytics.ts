import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';

export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (!analytics) return;
  try {
    logEvent(analytics, eventName, params);
  } catch {
    /* analytics unavailable */
  }
}

export function trackPageView(pageName: string): void {
  trackEvent('page_view', { page_name: pageName });
}

export function trackExerciseView(exerciseId: string): void {
  trackEvent('exercise_view', { exercise_id: exerciseId });
}

export function trackWorkoutStart(dayId: string): void {
  trackEvent('workout_start', { day_id: dayId });
}

export function trackWorkoutComplete(dayId: string): void {
  trackEvent('workout_complete', { day_id: dayId });
}

export function trackVisit(): void {
  trackEvent('user_visit');
}
