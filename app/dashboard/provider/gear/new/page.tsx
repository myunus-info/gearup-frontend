'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, ImagePlus, PackagePlus, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useCategories } from '@/hooks/use-gear';
import { useAddGear } from '@/hooks/use-provider';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import { gearFormSchema } from '@/lib/validations/gear-validation';
import Image from 'next/image';
import { useState } from 'react';
import { Category } from '@/types/types';

type GearFormValues = z.input<typeof gearFormSchema>;

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800';

export default function AddGearPage() {
  const router = useRouter();

  const { data: categories } = useCategories();
  const addGearMutation = useAddGear();

  const [images, setImages] = useState<string[]>([DEFAULT_IMAGE]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const { control, handleSubmit } = useForm<GearFormValues>({
    resolver: zodResolver(gearFormSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      description: '',
      brand: '',
      pricePerDay: 35,
      depositAmount: 100,
      quantityTotal: 3,
      condition: 'GOOD',
    },
  });

  const handleAddImage = () => {
    const url = newImageUrl.trim();

    if (!url) {
      return;
    }

    try {
      const parsedUrl = new URL(url);

      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }

      setImages(current => [...current, url]);
      setNewImageUrl('');
    } catch {
      toast.error('Please enter a valid HTTP/HTTPS image URL');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(current => current.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: GearFormValues) => {
    try {
      const result = await addGearMutation.mutateAsync({
        name: data.name,
        categoryId: data.categoryId,
        description: data.description,
        brand: data.brand,
        pricePerDay: Number(data.pricePerDay),
        depositAmount: Number(data.depositAmount),
        quantityTotal: Number(data.quantityTotal),
        condition: data.condition,
        images: images.length > 0 ? images : undefined,
      });

      if (result?.success) router.push('/dashboard/provider/gear');
    } catch {
      // Error is handled by useAddGear mutation.
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back */}
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/provider/gear"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Gear Inventory</span>
        </Link>
      </div>

      {/* Header */}
      <DashboardHeader
        heading="Add New Equipment"
        subheading="List outdoor gear, tents, kayaks, bikes, or climbing sets for customer rental."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FieldGroup>
          {/* ========================================================= */}
          {/* GENERAL INFORMATION */}
          {/* ========================================================= */}

          <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="flex items-center gap-2 border-b pb-3 text-base font-bold text-slate-900 dark:text-slate-100">
              <PackagePlus className="h-4 w-4 text-emerald-600" />
              General Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Equipment Name */}
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5 sm:col-span-2">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Equipment Title / Model *
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      placeholder="e.g. MSR Hubba Hubba 2-Person Ultralight Backpacking Tent"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Category */}
              <Controller
                name="categoryId"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Category *
                    </FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
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

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                      Brand / Manufacturer
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      placeholder="e.g. MSR, Patagonia, Santa Cruz, Burton"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                      Description & Inclusions
                    </FieldLabel>

                    <Textarea
                      {...field}
                      id={field.name}
                      placeholder="Detail the features, technical specs, weight, dimensions, and included accessories..."
                      rows={4}
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* PRICING / STOCK / CONDITION */}
          {/* ========================================================= */}

          <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="border-b pb-3 text-base font-bold text-slate-900 dark:text-slate-100">
              Pricing, Stock & Condition
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Daily Rate */}
              <Controller
                name="pricePerDay"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Daily Rate ($/day) *
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      step="0.01"
                      min="1"
                      value={typeof field.value === 'number' ? field.value : ''}
                      onChange={event => field.onChange(event.target.valueAsNumber)}
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                      Security Deposit ($)
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      step="0.01"
                      min="0"
                      value={typeof field.value === 'number' ? field.value : ''}
                      onChange={event => field.onChange(event.target.valueAsNumber)}
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Quantity */}
              <Controller
                name="quantityTotal"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Total Stock Units *
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      min={1}
                      step={1}
                      value={typeof field.value === 'number' ? field.value : ''}
                      onChange={event => {
                        const value = event.target.value;
                        field.onChange(value === '' ? undefined : event.target.valueAsNumber);
                      }}
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Condition */}
              <Controller
                name="condition"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Condition *
                    </FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEW">Brand New</SelectItem>
                        <SelectItem value="GOOD">Good Condition</SelectItem>
                        <SelectItem value="FAIR">Fair Condition</SelectItem>
                        <SelectItem value="WORN">Worn / Functional</SelectItem>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* IMAGE GALLERY */}
          {/* ========================================================= */}

          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="flex items-center gap-2 border-b pb-3 text-base font-bold text-slate-900 dark:text-slate-100">
              <ImagePlus className="h-4 w-4 text-emerald-600" />
              Equipment Photos & Gallery
            </h3>

            <div className="flex gap-2">
              <Input
                placeholder="Paste direct image URL (https://images.unsplash.com/...)"
                value={newImageUrl}
                onChange={event => setNewImageUrl(event.target.value)}
                className="text-sm"
              />

              <Button
                type="button"
                onClick={handleAddImage}
                variant="outline"
                className="shrink-0 font-semibold"
              >
                Add URL
              </Button>
            </div>

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
                    aria-label={`Remove image ${index + 1}`}
                    className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white opacity-0 shadow-md transition group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* SUBMIT */}
          {/* ========================================================= */}

          <div className="flex justify-end gap-3 border-t pt-4">
            <Link href="/dashboard/provider/gear">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>

            <Button type="submit" className="gap-2 px-8 font-bold" disabled={addGearMutation.isPending}>
              <Sparkles className="h-4 w-4" />

              {addGearMutation.isPending ? 'Saving Gear...' : 'Publish to Marketplace'}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
