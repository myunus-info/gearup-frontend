'use client';

import { PublicFooter } from '@/components/layout/public/Footer';
import { PublicHeader } from '@/components/layout/public/Header';
import dynamic from 'next/dynamic';
import type React from 'react';

// Lazy-load the floating AI Adventure Concierge widget to minimize initial bundle footprint
const AIChatAssistant = dynamic(
  () => import('@/components/shared/ai-chat-assistant').then((mod) => mod.AIChatAssistant),
  { ssr: false },
);

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      {/* Platform-Wide AI Concierge Chatbot Widget (Lazy Loaded) */}
      <AIChatAssistant />
    </div>
  );
}
