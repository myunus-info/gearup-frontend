'use client';

import { createContext, useContext, useState } from 'react';

export interface PaymentDraft {
  gearId: string;
  startDate: string;
  endDate: string;
  quantity: number;
  orderId?: string;
}

interface PaymentDraftContextValue {
  paymentDraft: PaymentDraft | null;
  setPaymentDraft: (draft: PaymentDraft) => void;
  clearPaymentDraft: () => void;
}

const PaymentDraftContext = createContext<PaymentDraftContextValue | undefined>(undefined);

export function PaymentDraftProvider({ children }: { children: React.ReactNode }) {
  const [paymentDraft, setPaymentDraft] = useState<PaymentDraft | null>(null);

  return (
    <PaymentDraftContext.Provider
      value={{
        paymentDraft,
        setPaymentDraft,
        clearPaymentDraft: () => setPaymentDraft(null),
      }}
    >
      {children}
    </PaymentDraftContext.Provider>
  );
}

export function usePaymentDraft() {
  const context = useContext(PaymentDraftContext);

  if (!context) {
    throw new Error('usePaymentDraft must be used within a PaymentDraftProvider');
  }

  return context;
}
