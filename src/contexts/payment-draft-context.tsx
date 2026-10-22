'use client';

import { createContext, useContext, useEffect, useState } from 'react';

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

const STORAGE_KEY = 'gearup_payment_draft';

const PaymentDraftContext = createContext<PaymentDraftContextValue | undefined>(undefined);

export function PaymentDraftProvider({ children }: { children: React.ReactNode }) {
  const [paymentDraft, setPaymentDraftState] = useState<PaymentDraft | null>(null);

  // Rehydrate draft from sessionStorage on client mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPaymentDraftState(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  const setPaymentDraft = (draft: PaymentDraft) => {
    setPaymentDraftState(draft);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Ignore storage errors
    }
  };

  const clearPaymentDraft = () => {
    setPaymentDraftState(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <PaymentDraftContext.Provider
      value={{
        paymentDraft,
        setPaymentDraft,
        clearPaymentDraft,
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
