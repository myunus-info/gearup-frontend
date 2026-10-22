'use client';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { RoleBadge } from '@/components/shared/role-badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdminUsers, useUpdateUserStatus, useUrlParams } from '@/hooks';
import { formatDate } from '@/lib/utils';
import type { User, UserStatus } from '@/types';
import { Search, UserCheck, UserX, Users } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAdminUsers();
  const updateUserStatusMutation = useUpdateUserStatus();
  const { getParam, setParams } = useUrlParams();

  const [search, setSearch] = useState(getParam('search', ''));
  const [roleFilter, setRoleFilter] = useState(getParam('role', 'all'));
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    setParams(
      {
        search: search || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
      },
      { scroll: false },
    );
  }, [search, roleFilter, setParams]);

  const filteredUsers = (users || []).filter((u: User) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleToggleStatus = (user: User) => {
    const nextStatus: UserStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    updateUserStatusMutation.mutate({
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
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 text-sm rounded-xl border-border bg-card"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'CUSTOMER', 'PROVIDER', 'ADMIN'].map((r) => (
            <button
              key={r}
              onClick={() => {
                setRoleFilter(r);
                setCurrentPage(1);
              }}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer shrink-0 ${
                roleFilter === r
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {r === 'all' ? 'All Roles' : r}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : filteredUsers && filteredUsers.length > 0 ? (
        <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact / Shop</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Moderation Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user: User) => (
                  <TableRow key={user.id} className="border-border hover:bg-muted/40">
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
                          <span className="font-semibold text-foreground block text-sm truncate">
                            {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate block">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>

                    <TableCell>
                      <div className="text-xs">
                        {user.providerProfile?.shopName ? (
                          <span className="font-semibold block text-emerald-500">
                            {user.providerProfile.shopName}
                          </span>
                        ) : (
                          <span className="text-foreground">{user.phone || 'No phone listed'}</span>
                        )}
                        <span className="text-muted-foreground">
                          {user.address || 'Standard Member'}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>

                    <TableCell className="text-right">
                      {user.role !== 'ADMIN' && (
                        <Button
                          variant={user.status === 'ACTIVE' ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={() => handleToggleStatus(user)}
                          disabled={updateUserStatusMutation.isPending}
                          className="text-xs font-semibold gap-1 rounded-xl cursor-pointer"
                        >
                          {user.status === 'ACTIVE' ? (
                            <>
                              <UserX className="h-3.5 w-3.5" />
                              <span>Suspend</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                              <span className="text-emerald-500">Activate</span>
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

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-card">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <h4 className="font-bold text-foreground">No users match the search filters</h4>
        </div>
      )}
    </div>
  );
}
