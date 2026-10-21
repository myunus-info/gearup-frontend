'use client';

import type { IUser } from '@/types/types';
import { createContext, useContext } from 'react';

export const UserContext = createContext<IUser | null>(null);

export function useUser() {
  return useContext(UserContext);
}
