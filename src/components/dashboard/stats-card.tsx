import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import type React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }> | any;
  trend?: string;
  trendPositive?: boolean;
  className?: string;
  iconClassName?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendPositive = true,
  className,
  iconClassName,
}: StatsCardProps) {
  return (
    <Card className={cn('overflow-hidden border-border bg-card shadow-xs', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
              iconClassName,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-2xl font-bold text-foreground sm:text-3xl">{value}</h3>

          {(description || trend) && (
            <div className="mt-1.5 flex items-center gap-2 text-xs">
              {trend && (
                <span
                  className={cn(
                    'font-semibold',
                    trendPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500',
                  )}
                >
                  {trend}
                </span>
              )}
              {description && <span className="text-muted-foreground">{description}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
