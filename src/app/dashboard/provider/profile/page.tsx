'use client';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { RoleBadge } from '@/components/shared/role-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth, useGetMe } from '@/hooks';
import { formatDate } from '@/lib/utils';
import { Save, ShieldCheck, Store } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ProviderProfilePage() {
  const { user: authUser, updateUser } = useAuth();
  const { data: userQuery } = useGetMe();
  const currentUser = authUser || userQuery;

  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [shopBio, setShopBio] = useState(
    'Premier outdoor gear provider specializing in 4-season expedition tents, technical mountaineering gear, and high-volume pack rentals.',
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || 'Marcus Thorne');
      setShopName(currentUser.providerProfile?.shopName || 'Summit Peak Outfitters & Rentals');
      setPhone(currentUser.phone || '+1 (555) 345-6789');
      setAddress(currentUser.address || '120 Glacier Way, Anchorage, AK');
      setAvatarUrl(
        currentUser.avatarUrl ||
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250',
      );
    }
  }, [currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateUser({
      name,
      phone,
      address,
      avatarUrl,
      providerProfile: {
        ...(currentUser?.providerProfile || {
          id: 'prof-1',
          userId: currentUser?.id || 'u-1',
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
        shopName,
      },
    });
    setIsSaving(false);
    toast.success('Provider shop details and contact info saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <DashboardHeader
        heading="Shop Profile & Provider Settings"
        subheading="Manage your equipment rental shop branding, customer contact details, and pickup address."
      />

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-border pb-6">
          <div className="relative">
            <Image
              src={
                avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250'
              }
              alt={name || 'Provider'}
              width={88}
              height={88}
              className="h-22 w-22 rounded-2xl border-2 border-emerald-500 object-cover shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-lg shadow-xs">
              <Store className="h-4 w-4" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-bold text-foreground">
                {shopName || 'Summit Peak Outfitters'}
              </h3>
              <RoleBadge role="PROVIDER" />
            </div>
            <p className="text-xs text-muted-foreground">
              Manager: {name} • {currentUser?.email || 'provider@gearup.com'}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Verified Marketplace Outfitter • Instant Booking Enabled
            </p>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="shop-name-input" className="text-xs font-semibold text-foreground">
                Provider Shop / Brand Name
              </Label>
              <Input
                id="shop-name-input"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="rounded-xl border-border bg-background text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="shop-owner" className="text-xs font-semibold text-foreground">
                Representative Full Name
              </Label>
              <Input
                id="shop-owner"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-border bg-background text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="shop-email" className="text-xs font-semibold text-foreground">
                Email Address (Primary Login)
              </Label>
              <Input
                id="shop-email"
                value={currentUser?.email || 'provider@gearup.com'}
                disabled
                className="rounded-xl border-border bg-muted text-muted-foreground text-sm cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="shop-phone" className="text-xs font-semibold text-foreground">
                Shop Direct Phone
              </Label>
              <Input
                id="shop-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl border-border bg-background text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="shop-address" className="text-xs font-semibold text-foreground">
                Physical Shop Address (Equipment Pickup & Handoff Location)
              </Label>
              <Input
                id="shop-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-xl border-border bg-background text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="shop-avatar" className="text-xs font-semibold text-foreground">
                Shop Logo / Avatar URL
              </Label>
              <Input
                id="shop-avatar"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="rounded-xl border-border bg-background text-sm"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="shop-bio" className="text-xs font-semibold text-foreground">
                Shop Overview & Specialties
              </Label>
              <Textarea
                id="shop-bio"
                rows={3}
                value={shopBio}
                onChange={(e) => setShopBio(e.target.value)}
                className="rounded-xl border-border bg-background text-sm resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Displayed to customers on all your equipment listings
            </span>
            <Button
              type="submit"
              disabled={isSaving}
              className="gap-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Shop Profile</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
