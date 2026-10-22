'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useRegister } from '@/hooks';
import { registerSchema } from '@/validations/auth.validation';
import { useForm } from '@tanstack/react-form';
import { Building2, Store, User } from 'lucide-react';
import { useState } from 'react';

export function RegisterForm() {
  const registerMutation = useRegister();
  const isPending = registerMutation.isPending;
  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'PROVIDER'>('CUSTOMER');

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'CUSTOMER' as 'CUSTOMER' | 'PROVIDER',
      phone: '',
      address: '',
      shopName: '',
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        shopName: value.role === 'PROVIDER' ? value.shopName : undefined,
      };

      registerMutation.mutate(payload);
    },
  });

  const handleRoleChange = (role: 'CUSTOMER' | 'PROVIDER') => {
    setSelectedRole(role);
    form.setFieldValue('role', role);
  };

  return (
    <>
      {/* Role Selection */}
      <FieldGroup>
        <Field className="space-y-1.5">
          <FieldLabel className="text-xs font-semibold text-foreground">
            I am joining GearUp as a:
          </FieldLabel>

          <div className="grid grid-cols-2 gap-3">
            {/* Customer */}
            <button
              type="button"
              onClick={() => handleRoleChange('CUSTOMER')}
              disabled={isPending}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition cursor-pointer ${
                selectedRole === 'CUSTOMER'
                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500/30'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Customer</span>
            </button>

            {/* Provider */}
            <button
              type="button"
              onClick={() => handleRoleChange('PROVIDER')}
              disabled={isPending}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition cursor-pointer ${
                selectedRole === 'PROVIDER'
                  ? 'border-purple-500 bg-purple-500/15 text-purple-700 dark:text-purple-400 ring-2 ring-purple-500/30'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              <Store className="h-4 w-4" />
              <span>Gear Provider</span>
            </button>
          </div>
        </Field>
      </FieldGroup>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4 mt-4"
      >
        <FieldGroup>
          {/* Full Name */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const res = registerSchema.shape.name.safeParse(value);
                return res.success ? undefined : res.error.issues[0]?.message;
              },
            }}
          >
            {(field) => {
              const errors = field.state.meta.errors;
              const hasError = errors && errors.length > 0;
              return (
                <Field data-invalid={hasError} className="space-y-1.5">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-xs font-semibold text-foreground"
                  >
                    Full Name
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Alex Morgan"
                    aria-invalid={hasError}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground text-sm rounded-xl"
                  />
                  {hasError && (
                    <p className="text-xs text-destructive">{errors.filter(Boolean).join(', ')}</p>
                  )}
                </Field>
              );
            }}
          </form.Field>

          {/* Email */}
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const res = registerSchema.shape.email.safeParse(value);
                return res.success ? undefined : res.error.issues[0]?.message;
              },
            }}
          >
            {(field) => {
              const errors = field.state.meta.errors;
              const hasError = errors && errors.length > 0;
              return (
                <Field data-invalid={hasError} className="space-y-1.5">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-xs font-semibold text-foreground"
                  >
                    Email Address
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="alex@example.com"
                    aria-invalid={hasError}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground text-sm rounded-xl"
                  />
                  {hasError && (
                    <p className="text-xs text-destructive">{errors.filter(Boolean).join(', ')}</p>
                  )}
                </Field>
              );
            }}
          </form.Field>

          {/* Password */}
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                const res = registerSchema.shape.password.safeParse(value);
                return res.success ? undefined : res.error.issues[0]?.message;
              },
            }}
          >
            {(field) => {
              const errors = field.state.meta.errors;
              const hasError = errors && errors.length > 0;
              return (
                <Field data-invalid={hasError} className="space-y-1.5">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-xs font-semibold text-foreground"
                  >
                    Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="••••••••"
                    aria-invalid={hasError}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground text-sm rounded-xl"
                  />
                  {hasError && (
                    <p className="text-xs text-destructive">{errors.filter(Boolean).join(', ')}</p>
                  )}
                </Field>
              );
            }}
          </form.Field>

          {/* Provider Shop Name (Conditional) */}
          {selectedRole === 'PROVIDER' && (
            <form.Field
              name="shopName"
              validators={{
                onChange: ({ value }) => {
                  if (!value || value.trim().length < 2) {
                    return 'Shop name must be at least 2 characters';
                  }
                  return undefined;
                },
              }}
            >
              {(field) => {
                const errors = field.state.meta.errors;
                const hasError = errors && errors.length > 0;
                return (
                  <Field data-invalid={hasError} className="space-y-1.5">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs font-semibold text-purple-700 dark:text-purple-400 flex items-center gap-1.5"
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      <span>Shop / Business Name</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Alpine Ascent Rentals"
                      aria-invalid={hasError}
                      className="bg-background border-input text-foreground placeholder:text-muted-foreground text-sm rounded-xl"
                    />
                    {hasError && (
                      <p className="text-xs text-destructive">
                        {errors.filter(Boolean).join(', ')}
                      </p>
                    )}
                  </Field>
                );
              }}
            </form.Field>
          )}

          {/* Phone (Optional) */}
          <form.Field name="phone">
            {(field) => (
              <Field className="space-y-1.5">
                <FieldLabel htmlFor={field.name} className="text-xs font-semibold text-foreground">
                  Phone Number (optional)
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground text-sm rounded-xl"
                />
              </Field>
            )}
          </form.Field>

          {/* Address (Optional) */}
          <form.Field name="address">
            {(field) => (
              <Field className="space-y-1.5">
                <FieldLabel htmlFor={field.name} className="text-xs font-semibold text-foreground">
                  Address / City (optional)
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Seattle, WA"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground text-sm rounded-xl"
                />
              </Field>
            )}
          </form.Field>

          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="mt-3 w-full cursor-pointer rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20"
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

export default RegisterForm;
