'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGears } from '@/hooks';
import {
  ArrowRight,
  Bot,
  Calendar,
  Compass,
  DollarSign,
  Maximize2,
  MessageSquare,
  Minimize2,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestedGear?: {
    id: string;
    name: string;
    price: number;
    category: string;
    href?: string;
  }[];
}

const KNOWLEDGE_BASE: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['camp', 'hiking', 'hike', 'tent', 'backpack', 'trek'],
    answer:
      'For a backpacking or camping trip, we recommend starting with a weather-rated tent, an ergonomic backpack with rain cover, and a portable cooking kit. Check out our verified outdoor gear below:',
  },
  {
    keywords: ['photo', 'camera', 'drone', 'video', 'gimbal', 'lens'],
    answer:
      'For capturing cinematic outdoor footage, our top recommendations are rugged 4K action drones and stabilized camera setups. Here are top-rated cinematography items currently available:',
  },
  {
    keywords: ['water', 'kayak', 'paddle', 'surf', 'swim', 'lake'],
    answer:
      'Planning a lake or coastal excursion? Our certified water sports collection features durable kayaks and touring paddleboards:',
  },
  {
    keywords: ['climb', 'mountaineering', 'rope', 'harness', 'rock'],
    answer:
      'Safety is paramount when climbing. All our climbing ropes and harnesses undergo strict inspection before each rental:',
  },
  {
    keywords: ['deposit', 'security', 'money', 'refund', 'pay'],
    answer:
      'Security deposits protect equipment and are fully refunded to your original payment method immediately when you return the gear in agreed condition. Our deposits range from $10 to $80 depending on the equipment.',
  },
  {
    keywords: ['cancel', 'cancellation', 'policy', 'reschedule'],
    answer:
      'GearUp provides 100% free cancellation up to 48 hours prior to your scheduled rental pickup date with an immediate full refund.',
  },
  {
    keywords: ['damage', 'insurance', 'broken', 'protection'],
    answer:
      'Every reservation on GearUp includes our standard Damage Protection policy, safeguarding you against minor wear and accidental scratches. Zero liability for verified manufacturing defects!',
  },
  {
    keywords: ['provider', 'list', 'earn', 'rent out', 'shop'],
    answer:
      'You can register as a Provider to list your idle gear or adventure shop inventory. You set the daily price, deposit, and availability schedule, and earn 85% of each rental payout!',
  },
];

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { data: catalogGears } = useGears({ limit: 30 });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "👋 Hi! I'm GearUp AI Concierge. Tell me where you're heading or what gear you need, and I'll recommend the best equipment for your trip!",
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // 1. Prepare conversation history for LLM context
      const historyContext = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));

      // 2. Prepare gear catalog snapshot for real-time recommendation
      const gearSummary =
        catalogGears?.slice(0, 30).map((g) => ({
          id: g.id,
          name: g.name,
          category: g.category?.name || 'Outdoor Gear',
          pricePerDay: Number(g.pricePerDay),
        })) || [];

      // 3. Call server-side Gemini 3.8 Flash route handler
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: historyContext,
          gears: gearSummary,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.reply) {
        // Map recommended gear IDs to real database catalog items
        let suggestedGear: Message['suggestedGear'];
        if (Array.isArray(data.recommendedGearIds) && data.recommendedGearIds.length > 0) {
          const matchedItems =
            catalogGears?.filter((g) => data.recommendedGearIds.includes(g.id)) || [];

          if (matchedItems.length > 0) {
            suggestedGear = matchedItems.slice(0, 3).map((g) => ({
              id: g.id,
              name: g.name,
              price: Number(g.pricePerDay),
              category: g.category?.name || 'Outdoor Gear',
              href: `/gear/${g.id}`,
            }));
          }
        }

        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedGear,
        };

        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn('AI endpoint unavailable, using local heuristic fallback:', err);
    }

    // Immediate Heuristic Knowledge Base Fallback
    const lower = text.toLowerCase();
    const match = KNOWLEDGE_BASE.find((item) => item.keywords.some((kw) => lower.includes(kw)));

    const replyText =
      match?.answer ||
      "I'd love to help you plan your adventure! You can ask me about camping packages, mountain bikes, kayaks, camera drones, or our rental deposit policies.";

    let suggestedGear: Message['suggestedGear'];

    if (lower.includes('camp') || lower.includes('tent') || lower.includes('hike')) {
      const campMatches =
        catalogGears?.filter(
          (g) =>
            g.name.toLowerCase().includes('tent') ||
            g.name.toLowerCase().includes('pack') ||
            g.category?.name?.toLowerCase().includes('camp'),
        ) || [];

      if (campMatches.length > 0) {
        suggestedGear = campMatches.slice(0, 2).map((g) => ({
          id: g.id,
          name: g.name,
          price: Number(g.pricePerDay),
          category: g.category?.name || 'Camping & Hiking',
          href: `/gear/${g.id}`,
        }));
      } else {
        suggestedGear = [
          {
            id: 'search-camp',
            name: 'Explore Camping & Hiking Catalog',
            price: 35,
            category: 'Camping & Hiking',
            href: '/gear?search=camping',
          },
        ];
      }
    } else if (lower.includes('water') || lower.includes('kayak') || lower.includes('paddle')) {
      const waterMatches =
        catalogGears?.filter(
          (g) =>
            g.name.toLowerCase().includes('kayak') ||
            g.name.toLowerCase().includes('paddle') ||
            g.category?.name?.toLowerCase().includes('water'),
        ) || [];

      if (waterMatches.length > 0) {
        suggestedGear = waterMatches.slice(0, 2).map((g) => ({
          id: g.id,
          name: g.name,
          price: Number(g.pricePerDay),
          category: g.category?.name || 'Water Sports',
          href: `/gear/${g.id}`,
        }));
      } else {
        suggestedGear = [
          {
            id: 'search-water',
            name: 'Explore Kayaks & Water Equipment',
            price: 45,
            category: 'Water Sports',
            href: '/gear?search=kayak',
          },
        ];
      }
    } else if (lower.includes('photo') || lower.includes('drone') || lower.includes('camera')) {
      const droneMatches =
        catalogGears?.filter(
          (g) =>
            g.name.toLowerCase().includes('drone') ||
            g.name.toLowerCase().includes('camera') ||
            g.category?.name?.toLowerCase().includes('photo'),
        ) || [];

      if (droneMatches.length > 0) {
        suggestedGear = droneMatches.slice(0, 2).map((g) => ({
          id: g.id,
          name: g.name,
          price: Number(g.pricePerDay),
          category: g.category?.name || 'Photography & Drone Gear',
          href: `/gear/${g.id}`,
        }));
      } else {
        suggestedGear = [
          {
            id: 'search-photo',
            name: 'Explore Drones & Camera Gear',
            price: 65,
            category: 'Photography & Drone Gear',
            href: '/gear?search=drone',
          },
        ];
      }
    }

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedGear,
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const quickPrompts = [
    '🏕️ Recommended gear for a weekend hike?',
    '🛶 How does security deposit refund work?',
    '📷 Best drone or camera for video?',
    '🛡️ What if equipment gets damaged?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-500 p-3.5 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-emerald-400/30 cursor-pointer"
          aria-label="Open GearUp AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-200" />
            </span>
          </div>
          <span className="hidden sm:inline font-bold text-sm tracking-wide pr-1">
            Gear Concierge
          </span>
        </button>
      )}

      {isOpen && (
        <div className="w-[90vw] sm:w-[400px] h-[550px] max-h-[85vh] rounded-3xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-emerald-600/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-foreground">GearUp AI Concierge</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Gemini Flash
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">Smart Gear & Adventure Advisor</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                      : 'bg-muted/70 text-foreground border border-border/80 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>

                  {/* Suggested gear mini cards */}
                  {msg.suggestedGear && msg.suggestedGear.length > 0 && (
                    <div className="pt-2 space-y-2 border-t border-border/50">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                        ⚡ Recommended Equipment:
                      </span>
                      {msg.suggestedGear.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href || `/gear/${item.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2 rounded-xl bg-background/80 hover:bg-background border border-border/60 transition group cursor-pointer"
                        >
                          <div className="text-left">
                            <div className="font-semibold text-foreground text-[11px] group-hover:text-emerald-500 transition line-clamp-1">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground">{item.category}</div>
                          </div>
                          <div className="text-right pl-2 shrink-0">
                            <div className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                              ${item.price}
                              <span className="text-[9px] text-muted-foreground font-normal">
                                /day
                              </span>
                            </div>
                            <span className="text-[10px] text-emerald-500 flex items-center gap-0.5 justify-end">
                              View <ArrowRight className="h-2.5 w-2.5" />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-muted-foreground mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 p-2.5 rounded-2xl w-fit border border-border/50">
                <Bot className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
                <span className="text-[11px] animate-pulse">GearUp AI is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 border-t border-border bg-muted/20 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full border border-border bg-background hover:bg-muted text-[10px] text-muted-foreground hover:text-foreground transition cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-border flex items-center gap-2 bg-card"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about gear, hiking or rentals..."
              className="rounded-xl border-input bg-background text-xs h-10"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim()}
              className="h-10 w-10 shrink-0 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AIChatAssistant;
