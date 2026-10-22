'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ChevronDown,
  CreditCard,
  FileQuestion,
  HelpCircle,
  MessageSquare,
  PhoneCall,
  RotateCcw,
  Search,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

const FAQ_SECTIONS = [
  {
    category: 'Reservations & Payments',
    items: [
      {
        q: 'How does daily rate billing work?',
        a: 'Rental billing is calculated based on calendar days or 24-hour cycles between your chosen pickup date and return date. You are only billed for confirmed rental days.',
      },
      {
        q: 'When do I receive my security deposit refund?',
        a: 'Security deposits are held as a pre-authorization hold and released back to your card within 24 hours after the provider verifies gear condition upon return.',
      },
      {
        q: 'What payment methods are supported on GearUp?',
        a: 'We accept major credit/debit cards (Visa, MasterCard, Amex) through SSLCommerz and Stripe with enterprise-grade tokenization.',
      },
    ],
  },
  {
    category: 'Gear Pickup, Delivery & Returns',
    items: [
      {
        q: 'Where do I pick up the equipment?',
        a: 'Each listing specifies whether pickup is at the provider shop location, designated trailhead locker, or local courier delivery to your address.',
      },
      {
        q: 'Can I extend my rental while on the trail?',
        a: 'Yes, if the provider has no overlapping reservations, you can request an extension directly from your Customer Orders page.',
      },
      {
        q: 'What if I return equipment late?',
        a: 'Please notify your provider immediately. Late returns past 3 hours without prior notice may incur a standard half-day rental fee to compensate the next adventurer.',
      },
    ],
  },
  {
    category: 'Safety & Damage Protection',
    items: [
      {
        q: 'What does the standard Damage Protection cover?',
        a: 'Our policy covers ordinary trail scuffs, dirt, minor punctures in tents, and normal wear. Major structural damage or complete loss due to reckless operation may require deductible payment from the deposit.',
      },
      {
        q: 'How are climbing and watersport items certified?',
        a: 'All technical gear must be inspected according to UIAA or CE standards before every rental, including stitch counts, webbing integrity, and carabiner gates.',
      },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 shadow-2xs">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Support & Knowledge Base</span>
        </div>
        <h1 className="text-4xl font-black text-foreground tracking-tight">How Can We Help You?</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Find answers regarding equipment reservations, pickup logistics, security deposit refunds,
          and insurance coverage.
        </p>

        <div className="relative max-w-md mx-auto pt-4">
          <Search className="absolute left-3.5 top-7 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions (e.g. deposit, damage, return)..."
            className="pl-10 h-12 rounded-2xl border-input bg-card text-xs shadow-md"
          />
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl border border-border bg-card space-y-2 shadow-xs">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CreditCard className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Deposit & Refunds</h3>
          <p className="text-xs text-muted-foreground">
            Learn how deposit authorizations are held and released post-trip.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-border bg-card space-y-2 shadow-xs">
          <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Damage Protection</h3>
          <p className="text-xs text-muted-foreground">
            Zero liability coverage details for accidental trail wear.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-border bg-card space-y-2 shadow-xs">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <Truck className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Pickup Guidelines</h3>
          <p className="text-xs text-muted-foreground">
            Coordination protocols for shop pickup and return verification.
          </p>
        </div>
      </div>

      {/* Accordion FAQ Sections */}
      <div className="space-y-8">
        {FAQ_SECTIONS.map((section, sIdx) => {
          const filteredItems = section.items.filter(
            (i) =>
              !search ||
              i.q.toLowerCase().includes(search.toLowerCase()) ||
              i.a.toLowerCase().includes(search.toLowerCase()),
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={sIdx} className="space-y-4">
              <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">
                {section.category}
              </h2>
              <div className="space-y-3">
                {filteredItems.map((item, iIdx) => {
                  const key = `${sIdx}-${iIdx}`;
                  const isOpen = openItems[key];
                  return (
                    <div
                      key={iIdx}
                      className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs"
                    >
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-foreground hover:text-emerald-500 transition cursor-pointer"
                      >
                        <span>{item.q}</span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-emerald-500' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Still need help? */}
      <div className="rounded-3xl border border-border bg-muted/30 p-8 text-center space-y-4">
        <h3 className="text-lg font-bold text-foreground">Still have questions?</h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Our Boulder-based adventure support team is available 7 days a week to assist with custom
          expedition setups.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/contact">
            <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs">
              <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
              Contact Our Team
            </Button>
          </Link>
          <Button
            variant="outline"
            className="rounded-xl border-border text-xs font-semibold"
            onClick={() => {
              const aiBtn = document.querySelector(
                'button[aria-label="Open GearUp AI Assistant"]',
              ) as HTMLElement;
              aiBtn?.click();
            }}
          >
            Ask GearUp AI
          </Button>
        </div>
      </div>
    </div>
  );
}
