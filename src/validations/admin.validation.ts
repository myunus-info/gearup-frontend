import z from 'zod';

export const userStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED']),
  role: z.enum(['CUSTOMER', 'PROVIDER', 'ADMIN']).optional(),
});
