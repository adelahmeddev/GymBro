import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/types';
import { getLocalUser, createUser, updateLastActive, saveLocalUser } from '@/services/userService';

export function useAuth() {
  const [user, setUser] = useState<User | null>(getLocalUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      updateLastActive(user.id).catch(() => {});
    }
  }, [user]);

  const login = useCallback(async (fullName: string): Promise<User> => {
    setLoading(true);
    try {
      const newUser = await createUser(fullName);
      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback((updated: User) => {
    setUser(updated);
    saveLocalUser(updated);
  }, []);

  const refreshLastActive = useCallback(() => {
    if (user) {
      const now = Date.now();
      updateUser({ ...user, lastActiveAt: now });
    }
  }, [user, updateUser]);

  return { user, loading, login, updateUser, refreshLastActive };
}
