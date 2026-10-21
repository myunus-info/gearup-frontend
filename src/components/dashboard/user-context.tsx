'use client';

import { createContext, useContext } from 'react';
import type { IUser } from '@/types/types';

export const UserContext = createContext<IUser | null>(null);

export function useUser() {
  return useContext(UserContext);
}
