import z from 'zod';

export const gearFormSchema = z.object({
  name: z.string().min(2, 'Gear name must be at least 2 characters').max(150),
  categoryId: z.string().min(1, 'Please select a category'),
  description: z.string().optional(),
  brand: z.string().optional(),
  pricePerDay: z.coerce.number().positive('Daily rate must be greater than 0'),
  depositAmount: z.coerce.number().nonnegative('Deposit cannot be negative').optional(),
  quantityTotal: z.coerce.number().int().positive('Quantity must be at least 1'),
  condition: z.enum(['NEW', 'GOOD', 'FAIR', 'WORN']).default('GOOD'),
});
