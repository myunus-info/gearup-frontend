import type { User } from './auth.type';

export type IUserProfile = User;

export interface IUpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}
