import { doc, setDoc, getDoc, updateDoc, increment, collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db, hasConfig } from './firebase';
import type { User, DashboardStats } from '@/types';
import { getItem, setItem, removeItem } from './storage';
import { trackVisit } from './analytics';

const USER_STORAGE_KEY = 'current_user';

export function getLocalUser(): User | null {
  return getItem<User>(USER_STORAGE_KEY);
}

export function saveLocalUser(user: User): void {
  setItem(USER_STORAGE_KEY, user);
}

export function clearLocalUser(): void {
  removeItem(USER_STORAGE_KEY);
}

export async function createUser(fullName: string): Promise<User> {
  const id = crypto.randomUUID();
  const now = Date.now();
  const user: User = {
    id,
    fullName,
    createdAt: now,
    lastActiveAt: now,
  };

  if (hasConfig && db) {
    await setDoc(doc(db, 'users', id), user).catch(() => {});
  }
  saveLocalUser(user);
  trackVisit();
  return user;
}

export async function updateLastActive(userId: string): Promise<void> {
  const now = Date.now();

  if (hasConfig && db) {
    await updateDoc(doc(db, 'users', userId), { lastActiveAt: now }).catch(() => {});
  }

  const local = getLocalUser();
  if (local) {
    saveLocalUser({ ...local, lastActiveAt: now });
  }
  trackVisit();
}

export async function incrementVisitCount(): Promise<void> {
  if (!hasConfig || !db) return;
  const counterRef = doc(db, 'stats', 'visits');
  await setDoc(counterRef, { count: increment(1) }, { merge: true }).catch(() => {});
}

export async function incrementWorkoutCompletion(): Promise<void> {
  if (!hasConfig || !db) return;
  const counterRef = doc(db, 'stats', 'workouts');
  await setDoc(counterRef, { count: increment(1) }, { merge: true }).catch(() => {});
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const empty: DashboardStats = {
    totalUsers: 0,
    activeUsersToday: 0,
    totalVisits: 0,
    mostActiveUsers: [],
    workoutCompletionCount: 0,
    mostViewedExercises: [],
  };

  if (!hasConfig || !db) return empty;

  try {
    const usersRef = collection(db, 'users');
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [usersSnap, visitsSnap, workoutsSnap] = await Promise.all([
      getDocs(usersRef),
      getDoc(doc(db, 'stats', 'visits')),
      getDoc(doc(db, 'stats', 'workouts')),
    ]);

    const totalUsers = usersSnap.size;

    const activeTodayQuery = query(
      usersRef,
      where('lastActiveAt', '>=', todayStart.getTime()),
      orderBy('lastActiveAt', 'desc')
    );
    const activeTodaySnap = await getDocs(activeTodayQuery);
    const activeUsersToday = activeTodaySnap.size;

    const mostActiveQuery = query(
      usersRef,
      orderBy('lastActiveAt', 'desc'),
      limit(10)
    );
    const mostActiveSnap = await getDocs(mostActiveQuery);
    const mostActiveUsers = mostActiveSnap.docs.map((d) => ({
      name: (d.data() as User).fullName,
      count: 1,
    }));

    return {
      totalUsers,
      activeUsersToday,
      totalVisits: (visitsSnap.data() as { count: number } | undefined)?.count ?? 0,
      mostActiveUsers,
      workoutCompletionCount: (workoutsSnap.data() as { count: number } | undefined)?.count ?? 0,
      mostViewedExercises: [],
    };
  } catch {
    return empty;
  }
}
