'use client';

import { Calendar, CheckCircle2, DollarSign, Shield, Sparkles, Truck } from 'lucide-react';
import React from 'react';

export function Features() {
  const features = [
    {
      title: 'Top-Tier Technical Brands',
      description:
        'Reserve MSR, Osprey, Black Diamond, Sony, and Red Paddle without $3,000 retail tags.',
      icon: Sparkles,
      color: 'text-emerald-500',
    },
    {
      title: 'Certified Safety Inspection',
      description:
        'Climbing ropes, avalanche gear, and kayaks undergo multi-point inspection between reservations.',
      icon: Shield,
      color: 'text-cyan-500',
    },
    {
      title: 'Flexible Trailhead Dates',
      description:
        'Extend rental windows or reschedule dates through your dashboard with zero penalty fees.',
      icon: Calendar,
      color: 'text-amber-500',
    },
    {
      title: 'Direct Provider Coordination',
      description:
        'Chat directly with certified local outfitter shops for fitting advice and trailhead pickup.',
      icon: Truck,
      color: 'text-indigo-500',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">
            Why Rent with GearUp
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-2">
            Professional Equipment Without the Storage Locker
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Built for weekend warriors, summit climbers, and outdoor filmmakers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-background p-6 space-y-3 shadow-xs hover:border-emerald-500/40 transition-colors"
              >
                <div className={`p-2.5 rounded-xl bg-muted w-fit ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
