'use client';

import { useForm } from '@tanstack/react-form';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import * as z from 'zod';

import { useCategories, useGear } from '@/hooks/gear.hook';
import { useUpdateGear } from '@/hooks/provider.hook';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import type { Category } from '@/types';
import { ArrowLeft, ImagePlus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const editGearSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  pricePerDay: z.coerce.number().positive('Daily rate must be positive'),
  depositAmount: z.coerce.number().nonnegative('Deposit cannot be negative').optional(),
  quantityTotal: z.coerce
    .number()
    .int('Total stock must be a whole number')
    .positive('Total stock must be greater than 0'),
  quantityAvailable: z.coerce
    .number()
    .int('Available stock must be a whole number')
    .nonnegative('Available stock cannot be negative'),
  condition: z.enum(['NEW', 'GOOD', 'FAIR', 'WORN']).optional(),
});

export default function EditGearPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: gear, isLoading: gearLoading } = useGear(id);
  const { data: categories } = useCategories();
  const updateGearMutation = useUpdateGear();
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const form = useForm({
    defaultValues: {
      name: gear?.name || '',
      categoryId: gear?.categoryId || '',
      description: gear?.description || '',
      brand: gear?.brand || '',
      pricePerDay: Number(gear?.pricePerDay || 0),
      depositAmount: Number(gear?.depositAmount || 0),
      quantityTotal: gear?.quantityTotal || 1,
      quantityAvailable: gear?.quantityAvailable || 1,
      condition: (gear?.condition || 'GOOD') as 'NEW' | 'GOOD' | 'FAIR' | 'WORN',
    },
    onSubmit: async ({ value }) => {
      try {
        await updateGearMutation.mutateAsync({
          id,
          data: {
            name: value.name,
            categoryId: value.categoryId,
            description: value.description,
            brand: value.brand,
            pricePerDay: Number(value.pricePerDay),
            depositAmount: Number(value.depositAmount),
            quantityTotal: Number(value.quantityTotal),
            quantityAvailable: Number(value.quantityAvailable),
            condition: value.condition,
            images,
          },
        });

        router.push('/dashboard/provider/gear');
      } catch {
        // Mutation handles toast
      }
    },
  });

  useEffect(() => {
    if (gear) {
      form.setFieldValue('name', gear.name);
      form.setFieldValue('categoryId', gear.categoryId);
      form.setFieldValue('description', gear.description || '');
      form.setFieldValue('brand', gear.brand || '');
      form.setFieldValue('pricePerDay', Number(gear.pricePerDay));
      form.setFieldValue('depositAmount', Number(gear.depositAmount || 0));
      form.setFieldValue('quantityTotal', gear.quantityTotal);
      form.setFieldValue('quantityAvailable', gear.quantityAvailable);
      form.setFieldValue('condition', (gear.condition || 'GOOD') as any);
      if (gear.images && gear.images.length > 0) {
        setImages(gear.images);
      }
    }
  }, [gear, form.setFieldValue]);

  const handleAddImage = () => {
    const url = newImageUrl.trim();
    if (!url) return;

    try {
      const parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
      setImages((current) => [...current, url]);
      setNewImageUrl('');
    } catch {
      toast.error('Please enter a valid HTTP/HTTPS image URL');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((current) => current.filter((_, i) => i !== index));
  };

  if (gearLoading) {
    return (
      <div className="max-w-4xl space-y-6 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="flex max-w-4xl flex-col items-center justify-center py-20 text-center">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Equipment not found
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          The equipment you are trying to edit does not exist.
        </p>
        <Link href="/dashboard/provider/gear" className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inventory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/dashboard/provider/gear"
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Inventory</span>
      </Link>

      <DashboardHeader
        heading={`Edit Equipment: ${gear.name}`}
        subheading="Update equipment specs, pricing, availability counts, and photo gallery."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <FieldGroup>
          {/* GENERAL INFORMATION */}
          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="border-b pb-3 text-base font-bold text-slate-900 dark:text-slate-100">
              General Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Name */}
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) => {
                    const res = editGearSchema.shape.name.safeParse(value);
                    return res.success ? undefined : res.error.issues[0]?.message;
                  },
                }}
              >
                {(field) => {
                  const errors = field.state.meta.errors;
                  const hasError = errors && errors.length > 0;
                  return (
                    <Field data-invalid={hasError} className="space-y-1.5 sm:col-span-2">
                      <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                        Equipment Title *
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. MSR Hubba Hubba 2-Person Tent"
                        aria-invalid={hasError}
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

              {/* Category */}
              <form.Field name="categoryId">
                {(field) => (
                  <Field className="space-y-1.5">
                    <FieldLabel htmlFor="categoryId" className="text-xs font-semibold">
                      Category
                    </FieldLabel>
                    <Select
                      value={field.state.value || ''}
                      onValueChange={(val) => field.handleChange(val)}
                    >
                      <SelectTrigger id="categoryId">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category: Category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              {/* Brand */}
              <form.Field name="brand">
                {(field) => (
                  <Field className="space-y-1.5">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Brand
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. MSR"
                    />
                  </Field>
                )}
              </form.Field>

              {/* Description */}
              <form.Field name="description">
                {(field) => (
                  <Field className="space-y-1.5 sm:col-span-2">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Description
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={3}
                      placeholder="Describe the equipment..."
                    />
                  </Field>
                )}
              </form.Field>
            </div>
          </div>

          {/* PRICING & STOCK */}
          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="border-b pb-3 text-base font-bold text-slate-900 dark:text-slate-100">
              Pricing, Stock & Condition
            </h3>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {/* Daily Rate */}
              <form.Field
                name="pricePerDay"
                validators={{
                  onChange: ({ value }) => {
                    if (Number(value) <= 0) return 'Daily rate must be positive';
                    return undefined;
                  },
                }}
              >
                {(field) => {
                  const errors = field.state.meta.errors;
                  const hasError = errors && errors.length > 0;
                  return (
                    <Field data-invalid={hasError} className="space-y-1.5">
                      <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                        Daily Rate ($)
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        step="0.01"
                        min="0"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.valueAsNumber || 0)}
                        aria-invalid={hasError}
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

              {/* Deposit */}
              <form.Field name="depositAmount">
                {(field) => (
                  <Field className="space-y-1.5">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Deposit ($)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      step="0.01"
                      min="0"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.valueAsNumber || 0)}
                    />
                  </Field>
                )}
              </form.Field>

              {/* Total Stock */}
              <form.Field
                name="quantityTotal"
                validators={{
                  onChange: ({ value }) => {
                    if (Number(value) < 1) return 'Total stock must be at least 1';
                    return undefined;
                  },
                }}
              >
                {(field) => {
                  const errors = field.state.meta.errors;
                  const hasError = errors && errors.length > 0;
                  return (
                    <Field data-invalid={hasError} className="space-y-1.5">
                      <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                        Total Stock
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min="1"
                        step="1"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.valueAsNumber || 1)}
                        aria-invalid={hasError}
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

              {/* Available Stock */}
              <form.Field
                name="quantityAvailable"
                validators={{
                  onChange: ({ value }) => {
                    if (Number(value) < 0) return 'Available stock cannot be negative';
                    return undefined;
                  },
                }}
              >
                {(field) => {
                  const errors = field.state.meta.errors;
                  const hasError = errors && errors.length > 0;
                  return (
                    <Field data-invalid={hasError} className="space-y-1.5">
                      <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                        Available Stock
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min="0"
                        step="1"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.valueAsNumber || 0)}
                        aria-invalid={hasError}
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
            </div>

            {/* Condition */}
            <form.Field name="condition">
              {(field) => (
                <Field className="max-w-xs space-y-1.5">
                  <FieldLabel htmlFor="condition" className="text-xs font-semibold">
                    Condition
                  </FieldLabel>
                  <Select
                    value={field.state.value || ''}
                    onValueChange={(val: any) => field.handleChange(val)}
                  >
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">Brand New</SelectItem>
                      <SelectItem value="GOOD">Good Condition</SelectItem>
                      <SelectItem value="FAIR">Fair Condition</SelectItem>
                      <SelectItem value="WORN">Worn / Functional</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>
          </div>

          {/* IMAGE GALLERY */}
          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b pb-3">
              <ImagePlus className="h-4 w-4 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Equipment Photos & Gallery
              </h3>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Paste new image URL"
                value={newImageUrl}
                onChange={(event) => setNewImageUrl(event.target.value)}
                className="text-sm"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddImage}
                className="shrink-0 font-semibold"
              >
                Add URL
              </Button>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
                {images.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="group relative aspect-video overflow-hidden rounded-xl border bg-slate-100 dark:bg-slate-800"
                  >
                    <Image
                      src={image}
                      alt={`Equipment photo ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      aria-label={`Remove photo ${index + 1}`}
                      className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white opacity-0 shadow-md transition group-hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FieldGroup>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Link href="/dashboard/provider/gear">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            className="gap-2 px-6 font-bold"
            disabled={updateGearMutation.isPending}
          >
            <Save className="h-4 w-4" />
            {updateGearMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
