import z from 'zod';

export const rentalOrderSchema = z.object({
  gearItemId: z.string().min(1, 'Gear item ID is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  quantity: z.coerce.number().int().positive('Quantity must be at least 1').default(1),
});
