'use client';

import { useEffect, use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useGear, useCategories } from '@/hooks/use-gear';
import { useUpdateGear } from '@/hooks/use-provider';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { ArrowLeft, ImagePlus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Category } from '@/types/types';

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

type EditGearFormValues = z.input<typeof editGearSchema>;

export default function EditGearPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: gear, isLoading: gearLoading } = useGear(id);
  const { data: categories } = useCategories();
  const updateGearMutation = useUpdateGear();
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const { control, handleSubmit, reset } = useForm<EditGearFormValues>({
    resolver: zodResolver(editGearSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      description: '',
      brand: '',
      pricePerDay: 0,
      depositAmount: 0,
      quantityTotal: 1,
      quantityAvailable: 1,
      condition: 'GOOD',
    },
  });

  /**
   * Populate the form when gear data arrives.
   */

  // const [images, setImages] = useState<string[] | null>(null);

  useEffect(() => {
    if (gear) {
      reset({
        name: gear.name,
        categoryId: gear.categoryId,
        description: gear.description || '',
        brand: gear.brand || '',
        pricePerDay: Number(gear.pricePerDay),
        depositAmount: Number(gear.depositAmount || 0),
        quantityTotal: gear.quantityTotal,
        quantityAvailable: gear.quantityAvailable,
        condition: gear.condition || 'GOOD',
      });
    }
  }, [gear, reset]);

  const currentImages = images ?? gear?.images ?? [];

  /**
   * Add image URL to gallery.
   */
  const handleAddImage = () => {
    const url = newImageUrl.trim();

    if (!url) return;

    try {
      const parsedUrl = new URL(url);

      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }

      setImages(currentImages => [...currentImages, url]);

      setNewImageUrl('');
    } catch {
      toast.error('Please enter a valid HTTP/HTTPS image URL');
    }
  };

  /**
   * Remove image from gallery.
   */
  const handleRemoveImage = (index: number) => {
    setImages(currentImages => currentImages.filter((_, i) => i !== index));
  };

  /**
   * Submit form.
   */
  const onSubmit = async (data: EditGearFormValues) => {
    try {
      await updateGearMutation.mutateAsync({
        id,
        payload: {
          name: data.name,
          categoryId: data.categoryId,
          description: data.description,
          brand: data.brand,
          pricePerDay: Number(data.pricePerDay),
          depositAmount: Number(data.depositAmount),
          quantityTotal: Number(data.quantityTotal),
          quantityAvailable: Number(data.quantityAvailable),
          condition: data.condition,
          images,
        },
      });

      router.push('/dashboard/provider/gear');
    } catch {
      // Mutation already handles the error/toast.
    }
  };

  /**
   * Loading state.
   */
  if (gearLoading) {
    return (
      <div className="max-w-4xl space-y-6 py-8">
        <Skeleton className="h-8 w-48" />

        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  /**
   * Gear not found.
   */
  if (!gear) {
    return (
      <div className="flex max-w-4xl flex-col items-center justify-center py-20 text-center">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Equipment not found</h2>

        <p className="mt-1 text-sm text-slate-500">The equipment you are trying to edit does not exist.</p>

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
      {/* Back link */}
      <Link
        href="/dashboard/provider/gear"
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Inventory</span>
      </Link>

      {/* Header */}
      <DashboardHeader
        heading={`Edit Equipment: ${gear.name}`}
        subheading="Update equipment specs, pricing, availability counts, and photo gallery."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          {/* ================================================== */}
          {/* GENERAL INFORMATION */}
          {/* ================================================== */}

          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="border-b pb-3 text-base font-bold text-slate-900 dark:text-slate-100">
              General Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Name */}
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5 sm:col-span-2">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Equipment Title *
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      placeholder="e.g. MSR Hubba Hubba 2-Person Tent"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-xs text-red-500" />
                    )}
                  </Field>
                )}
              />

              {/* Category */}
              <Controller
                name="categoryId"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                    <FieldLabel htmlFor="categoryId" className="text-xs font-semibold">
                      Category
                    </FieldLabel>

                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger id="categoryId" aria-invalid={fieldState.invalid}>
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

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-xs text-red-500" />
                    )}
                  </Field>
                )}
              />

              {/* Brand */}
              <Controller
                name="brand"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Brand
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      placeholder="e.g. MSR"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-xs text-red-500" />
                    )}
                  </Field>
                )}
              />

              {/* Description */}
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5 sm:col-span-2">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Description
                    </FieldLabel>

                    <Textarea
                      {...field}
                      id={field.name}
                      rows={3}
                      placeholder="Describe the equipment..."
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-xs text-red-500" />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>

          {/* ================================================== */}
          {/* PRICING & STOCK */}
          {/* ================================================== */}

          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="border-b pb-3 text-base font-bold text-slate-900 dark:text-slate-100">
              Pricing, Stock & Condition
            </h3>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {/* Daily Rate */}
              <Controller
                name="pricePerDay"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Daily Rate ($)
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      step="0.01"
                      min="0"
                      value={typeof field.value === 'number' ? field.value : ''}
                      onChange={event => field.onChange(event.target.value)}
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-xs text-red-500" />
                    )}
                  </Field>
                )}
              />

              {/* Deposit */}
              <Controller
                name="depositAmount"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Deposit ($)
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      step="0.01"
                      min="0"
                      value={Number(field.value) ?? ''}
                      onChange={event => field.onChange(event.target.value)}
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-xs text-red-500" />
                    )}
                  </Field>
                )}
              />

              {/* Total Stock */}
              <Controller
                name="quantityTotal"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Total Stock
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      min="1"
                      step="1"
                      value={typeof field.value === 'number' ? field.value : ''}
                      onChange={event => field.onChange(event.target.value)}
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-xs text-red-500" />
                    )}
                  </Field>
                )}
              />

              {/* Available Stock */}
              <Controller
                name="quantityAvailable"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Available Stock
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      min="0"
                      step="1"
                      value={typeof field.value === 'number' ? field.value : ''}
                      onChange={event => field.onChange(event.target.value)}
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-xs text-red-500" />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Condition */}
            <Controller
              name="condition"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="max-w-xs space-y-1.5">
                  <FieldLabel htmlFor="condition" className="text-xs font-semibold">
                    Condition
                  </FieldLabel>

                  <Select value={field.value || ''} onValueChange={field.onChange}>
                    <SelectTrigger id="condition" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select Condition" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="NEW">Brand New</SelectItem>
                      <SelectItem value="GOOD">Good Condition</SelectItem>
                      <SelectItem value="FAIR">Fair Condition</SelectItem>
                      <SelectItem value="WORN">Worn / Functional</SelectItem>
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className="text-xs text-red-500" />
                  )}
                </Field>
              )}
            />
          </div>

          {/* ================================================== */}
          {/* IMAGE GALLERY */}
          {/* ================================================== */}

          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b pb-3">
              <ImagePlus className="h-4 w-4 text-emerald-600" />

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Equipment Photos & Gallery
              </h3>
            </div>

            {/* Add image URL */}
            <div className="flex gap-2">
              <Input
                placeholder="Paste new image URL"
                value={newImageUrl}
                onChange={event => setNewImageUrl(event.target.value)}
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

            {/* Gallery */}
            {currentImages.length > 0 && (
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
                      className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white opacity-0 shadow-md transition group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length === 0 && (
              <div className="rounded-xl border border-dashed p-8 text-center">
                <ImagePlus className="mx-auto h-8 w-8 text-slate-400" />

                <p className="mt-2 text-xs text-slate-500">No equipment photos added yet.</p>
              </div>
            )}
          </div>
        </FieldGroup>

        {/* ================================================== */}
        {/* ACTIONS */}
        {/* ================================================== */}

        <div className="flex justify-end gap-3 border-t pt-4">
          <Link href="/dashboard/provider/gear">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>

          <Button type="submit" className="gap-2 px-6 font-bold" disabled={updateGearMutation.isPending}>
            <Save className="h-4 w-4" />

            {updateGearMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
