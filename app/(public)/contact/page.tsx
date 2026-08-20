'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Thank you! Your message has been sent to our gear support team.');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Support & Questions
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl">
          Get in Touch with GearUp
        </h1>
        <p className="text-sm text-slate-500">
          Have questions about a rental, deposit return, or becoming an equipment provider? We&apos;re here to
          help 7 days a week.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6 rounded-2xl border bg-slate-50 p-6 dark:bg-slate-900">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Adventure Support Hub</h3>

          <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Email Us</p>
                <p>support@gearup.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Call Us</p>
                <p>+1 (800) 555-GEAR (4327)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Headquarters</p>
                <p>
                  1200 Adventure Way, Suite 400
                  <br />
                  Seattle, WA 98101
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="md:col-span-2 rounded-2xl border bg-white p-8 dark:bg-slate-900">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Message Received!</h3>
              <p className="text-xs text-slate-500">Our support team typically replies within 2 hours.</p>
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Send Another Note
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contact-name">Your Name</Label>
                  <Input id="contact-name" placeholder="Alex Rivers" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact-email">Email Address</Label>
                  <Input id="contact-email" type="email" placeholder="alex@example.com" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact-subject">Subject</Label>
                <Input id="contact-subject" placeholder="Question about kayak rental or pickup" required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact-msg">Message</Label>
                <Textarea id="contact-msg" placeholder="Describe your inquiry..." rows={4} required />
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto font-bold gap-2 disabled:cursor-not-allowed disabled:pointer-events-auto"
                disabled
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
