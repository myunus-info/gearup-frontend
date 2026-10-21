import z from 'zod';

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Must include a lowercase letter')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[0-9]/, 'Must include a number'),
    role: z.enum(['CUSTOMER', 'PROVIDER']),
    phone: z.string().optional(),
    address: z.string().optional(),
    shopName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'PROVIDER' && (!data.shopName || data.shopName.trim().length < 2)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Shop name is required when registering as a provider',
        path: ['shopName'],
      });
    }
  });

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatarUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});
