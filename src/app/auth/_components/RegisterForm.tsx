'use client';

import { useState, useTransition } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import { User, Store, Building2 } from 'lucide-react';
import { registerAction } from '../_actions/registerAction';
import { registerSchema } from '@/lib/validations/auth-validation';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'PROVIDER'>('CUSTOMER');

  const { control, handleSubmit, setValue } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'CUSTOMER',
      phone: '',
      address: '',
      shopName: '',
    },
  });

  const handleRoleChange = (role: 'CUSTOMER' | 'PROVIDER') => {
    setSelectedRole(role);

    setValue('role', role, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = (data: RegisterFormValues) => {
    if (data.role === 'CUSTOMER') delete data.shopName;

    startTransition(async () => {
      const result = await registerAction(data);

      if (result.success) {
        toast.success(result?.message || 'Registration successful');
        router.push('/auth/login');
      } else if (!result.success) {
        toast.error(result?.message || 'Registration failed');
      }
    });
  };

  return (
    <>
      {/* Role Selection */}
      <FieldGroup>
        <Field>
          <FieldLabel className="text-xs font-semibold text-slate-300">I am joining GearUp as a:</FieldLabel>

          <div className="grid grid-cols-2 gap-3">
            {/* Customer */}
            <button
              type="button"
              onClick={() => handleRoleChange('CUSTOMER')}
              disabled={isPending}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
                selectedRole === 'CUSTOMER'
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-500/30'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <User className="h-4 w-4" />

              <span>Customer (Rent Gear)</span>
            </button>

            {/* Provider */}
            <button
              type="button"
              onClick={() => handleRoleChange('PROVIDER')}
              disabled={isPending}
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
        </Field>
      </FieldGroup>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-1">
        <FieldGroup>
          {/* Provider Shop Name */}
          {selectedRole === 'PROVIDER' && (
            <Controller
              name="shopName"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="space-y-1 rounded-xl border border-purple-500/40 bg-purple-950/30 p-3.5 animate-in fade-in-0 duration-200"
                >
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex items-center gap-1.5 text-xs font-bold text-purple-300"
                  >
                    <Building2 className="h-3.5 w-3.5 text-purple-400" />

                    <span>Shop / Business Name *</span>
                  </FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    placeholder="e.g. Summit Peak Outfitters"
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                    className="border-purple-500/50 bg-slate-950/80 text-sm text-white placeholder:text-slate-500"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className="text-xs text-red-400" />
                  )}
                </Field>
              )}
            />
          )}

          {/* Name + Email */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Name */}
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-1">
                  <FieldLabel htmlFor={field.name} className="text-xs font-medium text-slate-300">
                    Full Name *
                  </FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Sarah Jenkins"
                    autoComplete="name"
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                    className="border-slate-700 bg-slate-950/70 text-sm text-white"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className="text-xs text-red-400" />
                  )}
                </Field>
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-1">
                  <FieldLabel htmlFor={field.name} className="text-xs font-medium text-slate-300">
                    Email Address *
                  </FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    placeholder="sarah@example.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                    className="border-slate-700 bg-slate-950/70 text-sm text-white"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className="text-xs text-red-400" />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Password */}
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-1">
                <FieldLabel htmlFor={field.name} className="text-xs font-medium text-slate-300">
                  Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number) *
                </FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                  className="border-slate-700 bg-slate-950/70 text-sm text-white"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="text-xs text-red-400" />
                )}
              </Field>
            )}
          />

          {/* Phone + Address */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Phone */}
            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-1">
                  <FieldLabel htmlFor={field.name} className="text-xs font-medium text-slate-300">
                    Phone Number (Optional)
                  </FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    autoComplete="tel"
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                    className="border-slate-700 bg-slate-950/70 text-sm text-white"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className="text-xs text-red-400" />
                  )}
                </Field>
              )}
            />

            {/* Address */}
            <Controller
              name="address"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-1">
                  <FieldLabel htmlFor={field.name} className="text-xs font-medium text-slate-300">
                    City / Region
                  </FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Denver, CO"
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                    className="border-slate-700 bg-slate-950/70 text-sm text-white"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className="text-xs text-red-400" />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="mt-3 w-full cursor-pointer rounded-xl bg-emerald-500 font-bold text-slate-950 hover:bg-emerald-400"
          >
            {isPending
              ? 'Creating Account...'
              : `Create ${selectedRole === 'PROVIDER' ? 'Provider' : 'Customer'} Account`}
          </Button>
        </FieldGroup>
      </form>
    </>
  );
}
