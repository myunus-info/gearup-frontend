'use client';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { RoleBadge } from '@/components/shared/role-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useGetMe } from '@/hooks';
import { formatDate } from '@/lib/utils';
import { Save, Sparkles, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CustomerProfilePage() {
  const { user: authUser, updateUser } = useAuth();
  const { data: userQuery } = useGetMe();
  const currentUser = authUser || userQuery;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('+1 (555) 889-1122');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || 'Alex Morgan');
      setPhone(currentUser.phone || '+1 (555) 782-9901');
      setAddress(currentUser.address || '402 Pine St, Boulder, CO 80302');
      setAvatarUrl(
        currentUser.avatarUrl ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250',
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
    });
    setIsSaving(false);
    toast.success('Your customer profile details have been saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <DashboardHeader
        heading="Member Profile & Gear Coordinates"
        subheading="Manage your customer account details, gear delivery address, and emergency outdoor contacts."
      />

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-border pb-6">
          <div className="relative">
            <Image
              src={
                avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250'
              }
              alt={name || 'Customer'}
              width={88}
              height={88}
              className="h-22 w-22 rounded-2xl border-2 border-emerald-500 object-cover shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-lg shadow-xs">
              <UserIcon className="h-4 w-4" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-bold text-foreground">{name || 'Trail Explorer'}</h3>
              <RoleBadge role="CUSTOMER" />
            </div>
            <p className="text-xs text-muted-foreground">
              {currentUser?.email || 'customer@gearup.com'}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Member since {formatDate(currentUser?.createdAt || new Date().toISOString())} •
              Verified Renter
            </p>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="cust-name" className="text-xs font-semibold text-foreground">
                Full Name
              </Label>
              <Input
                id="cust-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-border bg-background text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cust-email" className="text-xs font-semibold text-foreground">
                Email Address (Primary Login)
              </Label>
              <Input
                id="cust-email"
                value={currentUser?.email || 'customer@gearup.com'}
                disabled
                className="rounded-xl border-border bg-muted text-muted-foreground text-sm cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cust-phone" className="text-xs font-semibold text-foreground">
                Primary Phone Number
              </Label>
              <Input
                id="cust-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl border-border bg-background text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cust-emergency" className="text-xs font-semibold text-foreground">
                Emergency Expedition Contact
              </Label>
              <Input
                id="cust-emergency"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="rounded-xl border-border bg-background text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="cust-address" className="text-xs font-semibold text-foreground">
                Delivery / Gear Pickup Address
              </Label>
              <Input
                id="cust-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-xl border-border bg-background text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="cust-avatar" className="text-xs font-semibold text-foreground">
                Avatar Photo URL
              </Label>
              <Input
                id="cust-avatar"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="rounded-xl border-border bg-background text-sm"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              Auto-filled during equipment reservations
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
                  <span>Save Profile Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
