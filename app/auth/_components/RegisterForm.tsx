'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Role } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Store, Building2 } from 'lucide-react';

const registerSchema = z
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

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { register: registerAuth, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'PROVIDER'>('CUSTOMER');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'CUSTOMER',
      name: '',
      email: '',
      password: '',
      shopName: '',
      phone: '',
      address: '',
    },
  });

  const handleRoleChange = (newRole: 'CUSTOMER' | 'PROVIDER') => {
    setSelectedRole(newRole);
    setValue('role', newRole);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    console.log('Data: ', data);
    await registerAuth({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role as Role,
      phone: data.phone,
      address: data.address,
      shopName: data.shopName,
    });
  };

  return (
    <>
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-slate-300">I am joining GearUp as a:</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleRoleChange('CUSTOMER')}
            className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
              selectedRole === 'CUSTOMER'
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-500/30'
                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Customer (Rent Gear)</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('PROVIDER')}
            className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
              selectedRole === 'PROVIDER'
                ? 'border-purple-500 bg-purple-500/20 text-purple-300 ring-2 ring-purple-500/30'
                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Store className="h-4 w-4" />
            <span>Provider (List Gear)</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <input type="hidden" {...register('role')} />

        {/* Provider Specific Shop Name Field */}
        {selectedRole === 'PROVIDER' && (
          <div className="space-y-1.5 rounded-xl border border-purple-500/40 bg-purple-950/30 p-3.5 animate-in fade-in-0 duration-200">
            <Label htmlFor="shopName" className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-purple-400" />
              <span>Shop / Business Name *</span>
            </Label>
            <Input
              id="shopName"
              placeholder="e.g. Summit Peak Outfitters"
              {...register('shopName')}
              className="bg-slate-950/80 border-purple-500/50 text-white placeholder:text-slate-500 text-sm"
            />
            {errors.shopName && <p className="text-xs text-red-400">{errors.shopName.message}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs text-slate-300 font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              placeholder="Sarah Jenkins"
              {...register('name')}
              className="bg-slate-950/70 border-slate-700 text-white text-sm"
            />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs text-slate-300 font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="sarah@example.com"
              {...register('email')}
              className="bg-slate-950/70 border-slate-700 text-white text-sm"
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-xs text-slate-300 font-medium">
            Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number) *
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            className="bg-slate-950/70 border-slate-700 text-white text-sm"
          />
          {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="phone" className="text-xs text-slate-300 font-medium">
              Phone Number (Optional)
            </Label>
            <Input
              id="phone"
              placeholder="+1 (555) 000-0000"
              {...register('phone')}
              className="bg-slate-950/70 border-slate-700 text-white text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="address" className="text-xs text-slate-300 font-medium">
              City / Region
            </Label>
            <Input
              id="address"
              placeholder="Denver, CO"
              {...register('address')}
              className="bg-slate-950/70 border-slate-700 text-white text-sm"
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-emerald-500 font-bold text-slate-950 hover:bg-emerald-400 rounded-xl mt-3 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading
            ? 'Creating Account...'
            : `Create ${selectedRole === 'PROVIDER' ? 'Provider' : 'Customer'} Account`}
        </Button>
      </form>
    </>
  );
}
