import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  max?: number;
  className?: string;
  showValue?: boolean;
}

export function RatingStars({ rating, max = 5, className, showValue = true }: RatingStarsProps) {
  const rounded = Math.round(rating * 10) / 10;

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="flex items-center text-amber-400">
        {Array.from({ length: max }).map((_, i) => {
          const isFilled = i < Math.floor(rating);
          const isPartial = i === Math.floor(rating) && rating % 1 >= 0.5;

          return (
            <Star
              key={i}
              className={cn(
                'h-4 w-4',
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : isPartial
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'text-slate-300 dark:text-slate-600',
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">
          {rounded > 0 ? rounded.toFixed(1) : 'New'}
        </span>
      )}
    </div>
  );
}
