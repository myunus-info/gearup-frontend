'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateReview } from '@/hooks/use-orders';
import type { RentalOrder, RentalOrderItem } from '@/types/types';
import { Sparkles, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

interface ReviewDialogProps {
  order: RentalOrder | null;
  item: RentalOrderItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewDialog({ order, item, isOpen, onClose }: ReviewDialogProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const createReviewMutation = useCreateReview();

  if (!order || !item) return null;

  const handleSubmit = async () => {
    if (!rating) {
      toast.error('Please select a star rating');
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        rentalOrderId: order.id,
        gearItemId: item.gearItemId,
        rating,
        comment: comment.trim() || undefined,
      });

      onClose();
      setComment('');
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Review Your Rental
          </DialogTitle>
          <DialogDescription>
            Share your experience with {item.gearItem?.name || 'this gear'} to help fellow outdoor
            enthusiasts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Item summary */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900 border">
            <Image
              src={
                item.gearItem?.images?.[0] ||
                'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'
              }
              alt={item.gearItem?.name || 'Gear'}
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm truncate">{item.gearItem?.name}</h4>
              <p className="text-xs text-slate-500">Brand: {item.gearItem?.brand || 'Pro Gear'}</p>
            </div>
          </div>

          {/* Star selector */}
          <div className="flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/60 border">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Overall Rating
            </Label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const isLit = (hoverRating ?? rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 transition hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        isLit
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {rating === 5
                ? '⭐⭐⭐⭐⭐ Outstanding!'
                : rating === 4
                  ? '⭐⭐⭐⭐ Great Experience'
                  : rating === 3
                    ? '⭐⭐⭐ Good / Average'
                    : rating === 2
                      ? '⭐⭐ Needs Improvement'
                      : '⭐ Disappointed'}
            </span>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <Label htmlFor="review-comment" className="text-xs font-semibold">
              Comments & Trail Feedback (Optional)
            </Label>
            <Textarea
              id="review-comment"
              placeholder="How did the gear perform on the trail or mountain? Any tips for future renters?"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={createReviewMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
