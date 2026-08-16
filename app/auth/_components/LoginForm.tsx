'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Mail } from 'lucide-react';
import { useTransition } from 'react';
import { loginAction } from '../_actions/authActions';
import { useForm, Controller } from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { loginSchema } from '@/lib/validations/auth-validation';

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: LoginFormValues) {
    startTransition(async () => {
      await loginAction(data);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-1.5">
              <FieldLabel htmlFor={field.name} className="text-xs font-semibold text-slate-300">
                Email Address
              </FieldLabel>

              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder="name@example.com"
                  aria-invalid={fieldState.invalid}
                  className="pl-9 bg-slate-950/70 border-slate-700 text-white placeholder:text-slate-500 text-sm"
                />
              </div>

              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} className="text-xs text-red-400" />
              )}
            </Field>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor={field.name} className="text-xs font-semibold text-slate-300">
                  Password
                </FieldLabel>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  placeholder="••••••••"
                  aria-invalid={fieldState.invalid}
                  className="pl-9 bg-slate-950/70 border-slate-700 text-white placeholder:text-slate-500 text-sm"
                />
              </div>

              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} className="text-xs text-red-400" />
              )}
            </Field>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full bg-emerald-500 font-bold text-slate-950 hover:bg-emerald-400 rounded-xl mt-2 cursor-pointer"
          disabled={isPending}
        >
          {isPending ? 'Signing in...' : 'Sign In to GearUp'}
        </Button>
      </FieldGroup>
    </form>
  );
}
