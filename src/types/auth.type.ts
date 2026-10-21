export type Role = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
export type UserRole = Role;

export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export interface ProviderProfile {
  id: string;
  userId: string;
  shopName: string;
  businessAddress?: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  address?: string | null;
  status: UserStatus;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  providerProfile?: ProviderProfile | null;
}

export type IAuthUser = User;

export interface LoginPayload {
  email: string;
  password: string;
}

export type ILoginPayload = LoginPayload;

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  address?: string;
  shopName?: string;
}

export type IRegisterPayload = RegisterPayload;

export interface LoginState {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type ILoginResponse = LoginState;

export interface IUser {
  success: boolean;
  message: string;
  data: User;
}

export interface NavbarProps {
  user: IUser;
}
