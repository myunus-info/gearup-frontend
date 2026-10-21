'use client';

import { useState } from 'react';
import { useAdminUsers, useUpdateUserStatus } from '@/hooks/use-admin';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { RoleBadge } from '@/components/shared/role-badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { Search, UserCheck, UserX, Users } from 'lucide-react';
import { User, UserStatus } from '@/types/types';
import Image from 'next/image';

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAdminUsers();
  const updateUserStatusMutation = useUpdateUserStatus();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users?.filter((u: User) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = async (user: User) => {
    const nextStatus: UserStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await updateUserStatusMutation.mutateAsync({
      id: user.id,
      status: nextStatus,
    });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="User Management & Governance"
        subheading="Inspect user accounts, manage platform roles, and activate or suspend access."
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['all', 'CUSTOMER', 'PROVIDER', 'ADMIN'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                roleFilter === r
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {r === 'all' ? 'All Users' : r}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border bg-white p-6 space-y-4 dark:bg-slate-900">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : filteredUsers && filteredUsers.length > 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact / Shop</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Moderation Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user: User) => (
                <TableRow key={user.id} className="hover:bg-slate-50/60">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={
                          user.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                        }
                        width={40}
                        height={40}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block text-sm truncate">
                          {user.name}
                        </span>
                        <span className="text-xs text-slate-400 truncate block">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>

                  <TableCell>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      {user.providerProfile?.shopName ? (
                        <span className="font-semibold block text-purple-700 dark:text-purple-300">
                          {user.providerProfile.shopName}
                        </span>
                      ) : (
                        <span>{user.phone || 'No phone listed'}</span>
                      )}
                      <span className="text-slate-400">{user.address || 'Standard Member'}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>

                  <TableCell className="text-xs text-slate-500">{formatDate(user.createdAt)}</TableCell>

                  <TableCell className="text-right">
                    {user.role !== 'ADMIN' && (
                      <Button
                        variant={user.status === 'ACTIVE' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleStatus(user)}
                        disabled={updateUserStatusMutation.isPending}
                        className="text-xs font-semibold gap-1"
                      >
                        {user.status === 'ACTIVE' ? (
                          <>
                            <UserX className="h-3.5 w-3.5" />
                            <span>Suspend User</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Activate User</span>
                          </>
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-12 text-center bg-white dark:bg-slate-900">
          <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 dark:text-slate-200">No users match the search filters</h4>
        </div>
      )}
    </div>
  );
}
