'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { PaymentDraftProvider } from '@/contexts/payment-draft-context';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <PaymentDraftProvider>
        <TooltipProvider>
          {children}
          <Toaster position="top-right" richColors />
        </TooltipProvider>
      </PaymentDraftProvider>
    </QueryClientProvider>
  );
}
