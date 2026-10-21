'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2, FileText, Lock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-500">
          <FileText className="h-3.5 w-3.5" />
          <span>Legal & Trust Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          Terms of Service & Rental Agreement
        </h1>
        <p className="text-xs text-muted-foreground">
          Last updated: October 2026 • Effective platform-wide
        </p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-xs leading-relaxed text-muted-foreground">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h2 className="text-base font-bold text-foreground">1. Agreement to Terms</h2>
          <p>
            By accessing or using the GearUp platform, applications, or marketplace services, you
            agree to be bound by these Terms of Service. If you disagree with any part of these
            terms, you may not access our services or reserve equipment.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h2 className="text-base font-bold text-foreground">
            2. Equipment Inspection & Return Standards
          </h2>
          <p>
            Customers are required to inspect the gear upon pickup with the provider. Any
            pre-existing defects must be noted on the rental checklist. Equipment must be returned
            by the agreed return time in clean, dry, and working order.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Tents must be dried completely before packing to prevent mildew damage.</li>
            <li>Inflatable watercraft must be washed of salt water and sand.</li>
            <li>Camera optics must be returned in their protective hardshell cases.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h2 className="text-base font-bold text-foreground">
            3. Security Deposits & Damage Protection
          </h2>
          <p>
            Security deposits are authorized during booking and released within 24 hours of
            successful gear return. GearUp includes standard zero-liability protection covering
            ordinary trail scuffs, dirt, and minor wear. In instances of negligent operation,
            intentional destruction, or loss, repair or replacement costs up to the deposit amount
            will be withheld.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h2 className="text-base font-bold text-foreground">4. Cancellation & Refund Policy</h2>
          <p>
            Reservations may be cancelled for a 100% full refund up to 48 hours prior to scheduled
            pickup time. Cancellations between 24 and 48 hours will receive a 50% refund.
            Cancellations under 24 hours are non-refundable to protect provider scheduling.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h2 className="text-base font-bold text-foreground">5. Privacy & Data Protection</h2>
          <p>
            We strictly protect your personal and payment data. Payment card numbers are processed
            via certified SSLCommerz and Stripe gateways; GearUp never stores raw CVV or card
            details. Identity credentials used for provider onboarding are encrypted at rest with
            AES-256.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-border">
        <Link href="/help" className="text-xs text-emerald-500 font-bold hover:underline">
          ← Back to Help Center
        </Link>
        <Link href="/contact">
          <Button variant="outline" size="sm" className="rounded-xl border-border text-xs">
            Contact Legal Team
          </Button>
        </Link>
      </div>
    </div>
  );
}
