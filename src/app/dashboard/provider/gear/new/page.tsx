'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { useCategories } from '@/hooks/gear.hook';
import { useAddGear } from '@/hooks/provider.hook';
import type { Category } from '@/types';
import { gearFormSchema } from '@/validations/gear.validation';
import { useForm } from '@tanstack/react-form';
import { ArrowLeft, ImagePlus, PackagePlus, Sparkles, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800';

export default function AddGearPage() {
  const router = useRouter();

  const { data: categories } = useCategories();
  const addGearMutation = useAddGear();

  const [images, setImages] = useState<string[]>([DEFAULT_IMAGE]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const form = useForm({
    defaultValues: {
      name: '',
      categoryId: '',
      description: '',
      brand: '',
      pricePerDay: 35,
      depositAmount: 100,
      quantityTotal: 3,
      condition: 'GOOD' as 'NEW' | 'GOOD' | 'FAIR' | 'WORN',
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await addGearMutation.mutateAsync({
          name: value.name,
          categoryId: value.categoryId,
          description: value.description,
          brand: value.brand,
          pricePerDay: Number(value.pricePerDay),
          depositAmount: Number(value.depositAmount),
          quantityTotal: Number(value.quantityTotal),
          condition: value.condition,
          images: images.length > 0 ? images : undefined,
        });

        if (result?.success) router.push('/dashboard/provider/gear');
      } catch {
        // Error is handled by useAddGear mutation
      }
    },
  });

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

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/provider/gear"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Gear Inventory</span>
        </Link>
      </div>

      <DashboardHeader
        heading="Add New Equipment"
        subheading="List outdoor gear, tents, kayaks, bikes, or climbing sets for customer rental."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-8"
      >
        <FieldGroup>
          {/* GENERAL INFORMATION */}
          <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="flex items-center gap-2 border-b pb-3 text-base font-bold text-slate-900 dark:text-slate-100">
              <PackagePlus className="h-4 w-4 text-emerald-600" />
              General Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Equipment Name */}
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) => {
                    const res = gearFormSchema.shape.name.safeParse(value);
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
                        Equipment Title / Model *
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. MSR Hubba Hubba 2-Person Ultralight Backpacking Tent"
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
              <form.Field
                name="categoryId"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Please select a category';
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
                        Category *
                      </FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(val) => field.handleChange(val)}
                      >
                        <SelectTrigger id={field.name} aria-invalid={hasError}>
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
                      {hasError && (
                        <p className="text-xs text-destructive">
                          {errors.filter(Boolean).join(', ')}
                        </p>
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Brand */}
              <form.Field name="brand">
                {(field) => (
                  <Field className="space-y-1.5">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Brand / Manufacturer
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. MSR, Patagonia, Santa Cruz, Burton"
                    />
                  </Field>
                )}
              </form.Field>

              {/* Description */}
              <form.Field name="description">
                {(field) => (
                  <Field className="space-y-1.5 sm:col-span-2">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Description & Inclusions
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Detail the features, technical specs, weight, dimensions, and included accessories..."
                      rows={4}
                    />
                  </Field>
                )}
              </form.Field>
            </div>
          </div>

          {/* PRICING / STOCK / CONDITION */}
          <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="border-b pb-3 text-base font-bold text-slate-900 dark:text-slate-100">
              Pricing, Stock & Condition
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Daily Rate */}
              <form.Field
                name="pricePerDay"
                validators={{
                  onChange: ({ value }) => {
                    if (Number(value) <= 0) return 'Daily rate must be greater than 0';
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
                        Daily Rate ($/day) *
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        step="0.01"
                        min="1"
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
                      Security Deposit ($)
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

              {/* Quantity */}
              <form.Field
                name="quantityTotal"
                validators={{
                  onChange: ({ value }) => {
                    if (Number(value) < 1) return 'Quantity must be at least 1';
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
                        Total Stock Units *
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min={1}
                        step={1}
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

              {/* Condition */}
              <form.Field name="condition">
                {(field) => (
                  <Field className="space-y-1.5">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold">
                      Condition *
                    </FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(val: any) => field.handleChange(val)}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="Condition" />
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
          </div>

          {/* IMAGE GALLERY */}
          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="flex items-center gap-2 border-b pb-3 text-base font-bold text-slate-900 dark:text-slate-100">
              <ImagePlus className="h-4 w-4 text-emerald-600" />
              Equipment Photos & Gallery
            </h3>

            <div className="flex gap-2">
              <Input
                placeholder="Paste direct image URL (https://images.unsplash.com/...)"
                value={newImageUrl}
                onChange={(event) => setNewImageUrl(event.target.value)}
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
                    className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white opacity-0 shadow-md transition group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Link href="/dashboard/provider/gear">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              className="gap-2 px-8 font-bold"
              disabled={addGearMutation.isPending}
            >
              <Sparkles className="h-4 w-4" />
              {addGearMutation.isPending ? 'Saving Gear...' : 'Publish to Marketplace'}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
