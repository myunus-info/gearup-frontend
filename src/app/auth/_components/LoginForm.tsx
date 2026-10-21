'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { loginSchema } from '@/lib/validations/auth-validation';
import { useAuth } from '@/providers/authProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, Mail, ShieldCheck, Store, User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type * as z from 'zod';
import { loginAction } from '../_actions/loginAction';

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '';
  const { demoLogin, login } = useAuth();

  const { control, handleSubmit, setValue } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleFillDemo = async (role: 'ADMIN' | 'PROVIDER' | 'CUSTOMER') => {
    let email = 'customer@gearup.com';
    if (role === 'ADMIN') email = 'admin@gearup.com';
    if (role === 'PROVIDER') email = 'provider@gearup.com';

    setValue('email', email, { shouldValidate: true });
    setValue('password', 'Password123!', { shouldValidate: true });

    startTransition(async () => {
      await demoLogin(role);
    });
  };

  function onSubmit(data: LoginFormValues) {
    startTransition(async () => {
      const ok = await login(data, redirectTo);
      if (!ok) {
        // Fallback to server action
        const result = await loginAction(redirectTo, data);
        if (!result.success) {
          toast.error(result?.message || 'Login failed');
        }
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* 1-Click Demo Profiles */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            ⚡ 1-Click Demo Logins
          </span>
          <span className="text-[10px] text-muted-foreground">Instant full access</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleFillDemo('ADMIN')}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-red-500/20 bg-red-950/20 hover:bg-red-950/40 text-red-300 transition-all text-xs font-medium cursor-pointer hover:border-red-500/40"
          >
            <ShieldCheck className="h-4 w-4 mb-1 text-red-400" />
            <span>Admin</span>
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleFillDemo('PROVIDER')}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-amber-500/20 bg-amber-950/20 hover:bg-amber-950/40 text-amber-300 transition-all text-xs font-medium cursor-pointer hover:border-amber-500/40"
          >
            <Store className="h-4 w-4 mb-1 text-amber-400" />
            <span>Provider</span>
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleFillDemo('CUSTOMER')}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-emerald-500/20 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-300 transition-all text-xs font-medium cursor-pointer hover:border-emerald-500/40"
          >
            <User className="h-4 w-4 mb-1 text-emerald-400" />
            <span>Customer</span>
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-center text-xs text-muted-foreground">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <span className="relative bg-card px-3 text-muted-foreground">or enter credentials</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FieldGroup>
          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                <FieldLabel htmlFor={field.name} className="text-xs font-semibold text-foreground">
                  Email Address
                </FieldLabel>

                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    placeholder="admin@gearup.com"
                    aria-invalid={fieldState.invalid}
                    className="pl-9 bg-background border-input text-foreground placeholder:text-muted-foreground text-sm rounded-xl"
                  />
                </div>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="text-xs text-destructive" />
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
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-xs font-semibold text-foreground"
                  >
                    Password
                  </FieldLabel>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                    className="pl-9 bg-background border-input text-foreground placeholder:text-muted-foreground text-sm rounded-xl"
                  />
                </div>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="text-xs text-destructive" />
                )}
              </Field>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-xl mt-3 cursor-pointer transition-all shadow-lg shadow-emerald-950/20"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
              </span>
            ) : (
              'Sign In to GearUp'
            )}
          </Button>
        </FieldGroup>
      </form>

      {/* Social Login simulation */}
      <div className="space-y-3 pt-2">
        <div className="relative flex items-center justify-center text-xs text-muted-foreground">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative bg-card px-3 text-muted-foreground">or continue with</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl border-border bg-background/50 hover:bg-muted text-xs cursor-pointer font-medium"
            onClick={() => handleFillDemo('CUSTOMER')}
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl border-border bg-background/50 hover:bg-muted text-xs cursor-pointer font-medium"
            onClick={() => handleFillDemo('CUSTOMER')}
          >
            <svg className="h-4 w-4 mr-2" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </Button>
        </div>
      </div>
    </div>
  );
}
