'use client';

import { DollarSign, Layers, Package, ShoppingBag, Users } from 'lucide-react';
import React from 'react';

interface KpiCardsProps {
  stats: {
    totalUsers?: number;
    totalGears?: number;
    totalRentals?: number;
    totalRevenue?: number;
    activeRentals?: number;
  };
}

export function KpiCards({ stats }: KpiCardsProps) {
  const cards = [
    {
      title: 'Total Users',
      value: (stats.totalUsers ?? 0).toLocaleString(),
      subtext: 'Registered customers & providers',
      icon: Users,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Gear Listings',
      value: (stats.totalGears ?? 0).toLocaleString(),
      subtext: 'Catalog equipment items',
      icon: Package,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Total Orders',
      value: (stats.totalRentals ?? 0).toLocaleString(),
      subtext: `${stats.activeRentals ?? 0} active rentals`,
      icon: ShoppingBag,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Gross Volume',
      value: `$${(stats.totalRevenue ?? 0).toLocaleString()}`,
      subtext: 'Processed rental payments',
      icon: DollarSign,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.bg}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KpiCards;
