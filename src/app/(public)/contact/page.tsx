'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Thank you! Your message has been routed to our outdoor gear support team.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 shadow-2xs">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>We&apos;re Here to Help</span>
        </div>
        <h1 className="text-4xl font-black text-foreground tracking-tight">Contact GearUp HQ</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Have a question about an upcoming reservation, becoming a certified equipment provider, or
          emergency damage support? Reach out to our Boulder team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-base text-foreground">Direct Support</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Email Us
                  </span>
                  <a
                    href="mailto:support@gearup.io"
                    className="font-bold text-foreground hover:text-emerald-500 transition"
                  >
                    support@gearup.io
                  </a>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Average response under 2 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Toll-Free Phone
                  </span>
                  <a
                    href="tel:+18005554327"
                    className="font-bold text-foreground hover:text-teal-500 transition"
                  >
                    +1 (800) 555-GEAR (4327)
                  </a>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Daily 6:00 AM – 10:00 PM MT
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Headquarters
                  </span>
                  <div className="font-bold text-foreground">
                    100 Adventure Way, Suite 400
                    <br />
                    Boulder, CO 80302
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Hours of Operation
                  </span>
                  <div className="font-bold text-foreground">Mon – Sun: 6am - 10pm MT</div>
                  <p className="text-[11px] text-muted-foreground">Emergency dispatch 24/7</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-2">
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" /> Trailside Emergency
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If you experience equipment failure in the backcountry, our emergency dispatch can
              arrange courier exchange at designated park ranger stations.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-xl lg:col-span-2">
          <h2 className="text-2xl font-black text-foreground mb-2">Send Us an Inquiry</h2>
          <p className="text-xs text-muted-foreground mb-6">
            Fill out the form below and an outdoor equipment specialist will get back to you
            promptly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="contact-name" className="text-xs font-bold text-foreground">
                  Full Name *
                </Label>
                <Input
                  id="contact-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Mercer"
                  required
                  className="rounded-xl border-input bg-background text-xs h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact-email" className="text-xs font-bold text-foreground">
                  Email Address *
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  required
                  className="rounded-xl border-input bg-background text-xs h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-subject" className="text-xs font-bold text-foreground">
                Subject
              </Label>
              <Input
                id="contact-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Question about rental deposit or provider onboarding"
                className="rounded-xl border-input bg-background text-xs h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-message" className="text-xs font-bold text-foreground">
                Message *
              </Label>
              <Textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your trip dates, destination, or question..."
                rows={5}
                required
                className="rounded-xl border-input bg-background text-xs resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-8 h-12 cursor-pointer shadow-md"
            >
              {isSubmitting ? 'Transmitting...' : 'Send Message'}
              <Send className="h-3.5 w-3.5 ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
