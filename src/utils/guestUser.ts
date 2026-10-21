import type { IUser } from '@/types/types';

export const guestUser: IUser = {
  success: false,
  message: 'Unauthorized user',
  data: {
    id: 'guest',
    name: 'Guest User',
    email: '',
    role: 'CUSTOMER',
    phone: null,
    address: null,
    status: 'ACTIVE',
    avatarUrl: null,
    createdAt: '',
    updatedAt: '',
    providerProfile: {
      id: '',
      userId: '',
      shopName: '',
      businessAddress: null,
      isVerified: false,
      createdAt: '',
      updatedAt: '',
    },
  },
};
