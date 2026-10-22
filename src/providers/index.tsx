'use client';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PaymentDraftProvider } from '@/contexts/payment-draft-context';
import type React from 'react';
import QueryProvider from './queryProvider';
import { ThemeProvider } from './themeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <QueryProvider>
        <PaymentDraftProvider>
          <TooltipProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </TooltipProvider>
        </PaymentDraftProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default Providers;
