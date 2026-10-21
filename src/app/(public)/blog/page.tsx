'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Calendar, Clock, Tag, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BLOG_POSTS = [
  {
    id: 'ultralight-backpacking-guide',
    title: 'The Ultralight Wilderness Packing Checklist: Shedding 15 Lbs',
    excerpt:
      'How modern carbon-fiber poles, silnylon tents, and titanium cooksets transform demanding 4-day ascents into enjoyable journeys.',
    author: 'Sarah Chen, AMGA Alpine Guide',
    date: 'October 18, 2026',
    readTime: '6 min read',
    category: 'Camping & Hiking',
    image:
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80',
    featured: true,
  },
  {
    id: 'cinematic-drone-video-tips',
    title: 'Capturing Cinematic Aerials in Cold Weather & Mountain Peaks',
    excerpt:
      'Critical battery temperature maintenance, ND filter selection, and wind stability protocols for 4K mountain videography.',
    author: 'Marcus Vance, Adventure Cinematographer',
    date: 'October 12, 2026',
    readTime: '8 min read',
    category: 'Photography & Drone Gear',
    image:
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
    featured: false,
  },
  {
    id: 'inflatable-paddleboard-vs-hard-kayak',
    title: 'Inflatable SUP vs. Rigid Touring Kayak: Which Is Right For Your Lake Trip?',
    excerpt:
      'Comparing packability, water speed, stability in coastal waves, and vehicle transport requirements for weekend explorers.',
    author: 'Elena Gomez, Coastal Paddling Instructor',
    date: 'October 05, 2026',
    readTime: '5 min read',
    category: 'Water Sports',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    featured: false,
  },
  {
    id: 'climbing-rope-safety-standards',
    title: 'Dynamic Climbing Ropes: UIAA Falls, Inspection Guidelines & Shelf Life',
    excerpt:
      'A comprehensive technical breakdown of how we inspect ropes and harnesses before each rental to ensure 100% security on pitch.',
    author: 'David Thorne, Safety Inspector',
    date: 'September 28, 2026',
    readTime: '7 min read',
    category: 'Climbing & Mountaineering',
    image:
      'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&auto=format&fit=crop&q=80',
    featured: false,
  },
];

export default function BlogPage() {
  const featured = BLOG_POSTS[0];
  const regular = BLOG_POSTS.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-500">
          <BookOpen className="h-3.5 w-3.5" />
          <span>GearUp Field Notes</span>
        </div>
        <h1 className="text-4xl font-black text-foreground tracking-tight">The Outdoor Journal</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Expert trail advice, gear maintenance breakdowns, and technical packing lists authored by
          verified guides.
        </p>
      </div>

      {/* Featured Post */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-16/10 lg:aspect-auto min-h-[300px] bg-muted">
          <Image src={featured.image} alt={featured.title} fill className="object-cover" priority />
          <div className="absolute top-4 left-4">
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-md">
              Featured Story
            </span>
          </div>
        </div>

        <div className="p-8 lg:p-12 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-emerald-500 font-bold uppercase tracking-wider">
              <span>{featured.category}</span>
              <span>•</span>
              <span className="text-muted-foreground">{featured.readTime}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground leading-snug">
              {featured.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{featured.excerpt}</p>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              <span className="font-bold text-foreground block">{featured.author}</span>
              <span>{featured.date}</span>
            </div>
            <Link href="/gear">
              <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs">
                <span>Read Full Article</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Regular Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {regular.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-xs hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white">
                  {post.category}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3 text-emerald-500" />
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="font-bold text-base text-foreground group-hover:text-emerald-500 transition line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[11px]">{post.author}</span>
                <Link
                  href="/gear"
                  className="text-emerald-500 font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  Read More <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
