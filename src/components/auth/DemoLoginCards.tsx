'use client';

import { KeyRound, Shield, Store, User } from 'lucide-react';
import React from 'react';

interface DemoLoginCardsProps {
  onFillCredentials?: (email: string, pass: string) => void;
}

export function DemoLoginCards({ onFillCredentials }: DemoLoginCardsProps) {
  const accounts = [
    {
      role: 'Admin',
      email: 'admin@gearup.com',
      password: 'Password123!',
      color: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400',
      icon: Shield,
    },
    {
      role: 'Provider',
      email: 'provider@gearup.com',
      password: 'Password123!',
      color: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
      icon: Store,
    },
    {
      role: 'Customer',
      email: 'customer@gearup.com',
      password: 'Password123!',
      color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
      icon: User,
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center space-x-2 text-xs font-semibold text-foreground">
        <KeyRound className="h-4 w-4 text-emerald-500" />
        <span>1-Click Demo Login</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {accounts.map((acc) => {
          const Icon = acc.icon;
          return (
            <button
              key={acc.role}
              type="button"
              onClick={() => onFillCredentials?.(acc.email, acc.password)}
              className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all hover:scale-[1.02] cursor-pointer ${acc.color}`}
            >
              <div className="flex items-center space-x-1.5 font-bold text-xs">
                <Icon className="h-3.5 w-3.5" />
                <span>{acc.role}</span>
              </div>
              <span className="text-[11px] font-mono opacity-80 mt-0.5 truncate w-full">
                {acc.email}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DemoLoginCards;
