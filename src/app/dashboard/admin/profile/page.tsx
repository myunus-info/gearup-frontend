'use client';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { RoleBadge } from '@/components/shared/role-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth, useGetMe } from '@/hooks';
import { formatDate } from '@/lib/utils';
import { Check, Save, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AdminProfilePage() {
  const { user: authUser, updateUser } = useAuth();
  const { data: userQuery } = useGetMe();
  const currentUser = authUser || userQuery;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState(
    'Platform System Administrator with full security and moderation privileges.',
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || 'Admin Officer');
      setPhone(currentUser.phone || '+1 (555) 902-3344');
      setAddress(currentUser.address || 'Pacific Northwest Operations Center, Seattle, WA');
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
    toast.success('Admin profile credentials & settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <DashboardHeader
        heading="Admin Account & Security Profile"
        subheading="Manage your administrative credentials, contact endpoints, and audit identities."
      />

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-border pb-6">
          <div className="relative">
            <Image
              src={
                avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250'
              }
              alt={name || 'Admin'}
              width={88}
              height={88}
              className="h-22 w-22 rounded-2xl border-2 border-emerald-500 object-cover shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-lg shadow-xs">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-bold text-foreground">
                {name || 'Platform Administrator'}
              </h3>
              <RoleBadge role="ADMIN" />
            </div>
            <p className="text-xs text-muted-foreground">
              {currentUser?.email || 'admin@gearup.com'}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Admin privileges active • Root tenant access enabled
            </p>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="prof-name" className="text-xs font-semibold text-foreground">
                Display Name
              </Label>
              <Input
                id="prof-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-border bg-background text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-email" className="text-xs font-semibold text-foreground">
                Registered Email (Immutable)
              </Label>
              <Input
                id="prof-email"
                value={currentUser?.email || 'admin@gearup.com'}
                disabled
                className="rounded-xl border-border bg-muted text-muted-foreground text-sm cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-phone" className="text-xs font-semibold text-foreground">
                Contact Phone
              </Label>
              <Input
                id="prof-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl border-border bg-background text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-address" className="text-xs font-semibold text-foreground">
                Operating Location
              </Label>
              <Input
                id="prof-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-xl border-border bg-background text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="prof-avatar" className="text-xs font-semibold text-foreground">
                Avatar Image URL
              </Label>
              <Input
                id="prof-avatar"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="rounded-xl border-border bg-background text-sm"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="prof-bio" className="text-xs font-semibold text-foreground">
                Administrative Notes / Bio
              </Label>
              <Textarea
                id="prof-bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="rounded-xl border-border bg-background text-sm resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              All changes persist across active administrative sessions
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
