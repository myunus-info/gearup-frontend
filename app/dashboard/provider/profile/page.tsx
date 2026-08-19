'use client';

import React, { useState } from 'react';
import { useGetMe } from '@/hooks/use-auth';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { RoleBadge } from '@/components/shared/role-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/utils';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function ProfilePage() {
  // const { user, role } = useAuth();
  const { data: user } = useGetMe();

  const [name, setName] = useState(user?.data?.name || 'Sarah Jenkins');
  const [phone, setPhone] = useState(user?.data?.phone || '+1 (555) 234-5678');
  const [address, setAddress] = useState(user?.data?.address || '742 Evergreen Terrace, Portland, OR');
  const [shopName, setShopName] = useState(user?.data?.providerProfile?.shopName || 'Annonymous Shop');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile information updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <DashboardHeader
        user={user}
        heading="Account & Profile Settings"
        subheading="Manage your personal details, contact coordinates, and shop profile."
      />

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 border-b pb-6">
          <Image
            src={
              user?.data?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
            }
            alt={user?.data?.name || 'User'}
            width={80}
            height={80}
            className="h-20 w-20 rounded-full border-2 border-emerald-500 object-cover shadow-md"
          />
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {user?.data?.name || 'User Name'}
              </h3>
              {user?.data?.role && <RoleBadge role={user?.data?.role} />}
            </div>
            <p className="text-xs text-slate-500">{user?.data?.email}</p>
            <p className="text-[11px] text-slate-400">
              Member since {formatDate(user?.data?.createdAt || new Date().toISOString())}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="prof-name" className="text-xs font-semibold">
                Full Name
              </Label>
              <Input id="prof-name" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-email" className="text-xs font-semibold">
                Email Address (Primary Login)
              </Label>
              <Input id="prof-email" value={user?.data?.email || ''} disabled />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-phone" className="text-xs font-semibold">
                Phone Number
              </Label>
              <Input id="prof-phone" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-address" className="text-xs font-semibold">
                City / Location
              </Label>
              <Input id="prof-address" value={address} onChange={e => setAddress(e.target.value)} />
            </div>

            {user?.data?.role === 'PROVIDER' && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="shop-name" className="text-xs font-semibold">
                  Provider Shop Name
                </Label>
                <Input id="shop-name" value={shopName} onChange={e => setShopName(e.target.value)} />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" className="gap-2 font-semibold cursor-not-allowed" disabled>
              <Save className="h-4 w-4" />
              <span>Save Profile Changes</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
