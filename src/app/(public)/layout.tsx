import { AIChatAssistant } from '@/components/shared/ai-chat-assistant';
import { Footer } from '@/components/shared/footer';
import { Navbar } from '@/components/shared/navbar';
import type React from 'react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Platform-Wide AI Concierge Chatbot Widget */}
      <AIChatAssistant />
    </div>
  );
}
