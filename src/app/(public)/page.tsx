'use client';

import { AISearchAutocomplete } from '@/components/shared/ai-search-autocomplete';
import { GearCard, GearCardSkeleton } from '@/components/shared/gear-card';
import { LazySection } from '@/components/shared/lazy-section';
import { Button } from '@/components/ui/button';
import { useCategories, useGears } from '@/hooks';
import {
  ArrowRight,
  Award,
  Bike,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronDown,
  Compass,
  HelpCircle,
  Mail,
  Mountain,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  Tent,
  Truck,
  Users,
  Waves,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function HomePage() {
  const router = useRouter();
  const { data: gears, isLoading: gearsLoading } = useGears({ limit: 8 });
  const { data: categories } = useCategories();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const categoryIcons: Record<string, React.ElementType> = {
    'Camping & Hiking': Tent,
    'Water Sports': Waves,
    'Cycling & Mountain Biking': Bike,
    'Winter Sports': Snowflake,
    'Climbing & Mountaineering': Mountain,
    'Photography & Drone Gear': Camera,
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing! Your 15% discount code is GEARUP15');
    setNewsletterEmail('');
  };

  const adventureKits = [
    {
      title: 'Ultralight Weekend Backpacking',
      category: 'Camping & Hiking',
      tag: 'Most Popular',
      price: '$45/day',
      image:
        'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80',
      items: [
        'MSR Hubba Hubba 2P Tent',
        'Osprey Atmos 65L Pack',
        'Therm-a-Rest NeoAir Pad',
        'PocketRocket Stove',
      ],
    },
    {
      title: 'Alpine Summit Push',
      category: 'Climbing',
      tag: 'Guide Favorite',
      price: '$75/day',
      image:
        'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&auto=format&fit=crop&q=80',
      items: [
        'Black Diamond Crampons',
        'Petzl Technical Ice Axe',
        'Mammut 60m Dry Rope',
        'Mountain Hardwear 4-Season Tent',
      ],
    },
    {
      title: 'Whitewater River Expedition',
      category: 'Water Sports',
      tag: 'Summer Pick',
      price: '$55/day',
      image:
        'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&auto=format&fit=crop&q=80',
      items: [
        'Advanced Elements Inflatable Kayak',
        'NRS Type V Rescue Vest',
        'Aqua-Bound Carbon Paddle',
        'Watershed 65L Dry Bag',
      ],
    },
    {
      title: 'Wilderness 4K Cinematography',
      category: 'Photography',
      tag: 'Pro Studio',
      price: '$95/day',
      image:
        'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
      items: [
        'DJI Mavic 3 Pro Cine Drone',
        'Sony FX3 Cinema Body',
        'Peak Design Carbon Tripod',
        'Pelican 1510 Protector Case',
      ],
    },
  ];

  const faqs = [
    {
      q: 'How does gear pickup and drop-off work?',
      a: 'Once your reservation is confirmed, you receive direct pickup coordinates for the verified local provider shop. Providers offer flexible handoff times, and many partner locations offer trailhead pickup or scheduled local courier delivery.',
    },
    {
      q: 'What happens if equipment is damaged during a rental?',
      a: 'All rentals booked through GearUp include standard wear-and-tear protection. For accidental damage, our Zero-Dispute Guarantee caps your liability strictly at the refundable security deposit, with full transparent digital condition logging.',
    },
    {
      q: 'Are all gear items sanitized and safety-inspected between rentals?',
      a: 'Yes. All equipment providers adhere to rigorous cleaning, drying, and manufacturer-recommended safety inspections before any item is approved for subsequent customer handoffs.',
    },
    {
      q: 'Can I cancel or reschedule my reservation if mountain weather turns bad?',
      a: 'Absolutely. Cancellations made 48 hours prior to reservation start dates receive a 100% full refund with zero penalty fees. Weather-related reschedule requests can be coordinated directly with providers at no extra charge.',
    },
    {
      q: 'How can local outdoor shops or guides list their equipment on GearUp?',
      a: 'Local outfitters and individual gear owners can register as a Provider in less than 2 minutes, configure rental rates and security deposits, and immediately start accepting bookings from thousands of outdoor enthusiasts.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION (Height restricted to 65% of screen viewport) */}
      <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden border-b border-border bg-slate-950 text-white">
        {/* Background Visual Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=80"
            alt="Alpine Wilderness Background"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-slate-950/70 to-slate-950/30" />
        </div>

        {/* Hero Interactive Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span>Verified Peer-to-Peer & Shop Rental Marketplace</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1] max-w-4xl mx-auto drop-shadow-sm">
            Rent Premium Adventure Gear.{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Own the Experience.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed drop-shadow-xs">
            Skip thousands in upfront gear purchases. Reserve technical camping, mountaineering,
            kayaking, and camera equipment from certified local shops.
          </p>

          {/* AI Semantic Autocomplete Search Component */}
          <div className="mx-auto max-w-2xl pt-2">
            <AISearchAutocomplete
              placeholder="Search gear or intent: 'winter tent', 'ultralight pack', 'climbing'..."
              onSearch={(query: string) => router.push(`/gear?search=${encodeURIComponent(query)}`)}
              onSelect={(gearId: string) => router.push(`/gear/${gearId}`)}
              className="shadow-2xl"
            />
          </div>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-medium mr-1">Trending Activities:</span>
            {['Backpacking', 'Alpine Climbing', 'Kayaking', 'Snowboarding', '4K Drones'].map(
              (term) => (
                <Link
                  key={term}
                  href={`/gear?search=${encodeURIComponent(term)}`}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300 hover:border-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all cursor-pointer backdrop-blur-xs"
                >
                  {term}
                </Link>
              ),
            )}
          </div>

          {/* Direct CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link href="/gear">
              <Button
                size="lg"
                className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-7 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span>Browse Gear Catalog</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>

            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 backdrop-blur-md cursor-pointer"
              >
                <span>List Your Equipment</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES GRID */}
      <section className="py-16 bg-muted/20 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                <Compass className="h-3.5 w-3.5" /> Explore by Activity
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                Gear for Every Expedition
              </h2>
            </div>
            <Link href="/gear">
              <Button
                variant="outline"
                className="rounded-xl border-border hover:bg-muted font-semibold text-xs"
              >
                <span>View All Categories</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories && categories.length > 0
              ? (categories as any[]).map((cat: any) => {
                  const Icon = categoryIcons[cat.name] || Compass;
                  return (
                    <Link
                      key={cat.id}
                      href={`/gear?categoryId=${cat.id}`}
                      className="group flex flex-col items-center text-center p-5 rounded-2xl border border-border bg-card hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 group-hover:text-white flex items-center justify-center transition-colors mb-3">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="font-bold text-xs text-foreground group-hover:text-emerald-500 transition line-clamp-1">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] text-muted-foreground mt-1">
                        {cat.gearCount ? `${cat.gearCount} items` : 'Available'}
                      </span>
                    </Link>
                  );
                })
              : Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
                ))}
          </div>
        </div>
      </section>

      {/* 3. CORE LISTING SECTION (4 Cards Per Row Desktop) */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" /> Top Rated Equipment
              </div>
              <h2 className="text-3xl font-black text-foreground">Featured Adventure Gear</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Hand-inspected, high-demand gear ready for instant reservation and pickup.
              </p>
            </div>
            <Link href="/gear">
              <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm">
                <span>Browse Full Catalog</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>

          {/* 4 Cards Per Row Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gearsLoading ? (
              Array.from({ length: 8 }).map((_, i) => <GearCardSkeleton key={i} />)
            ) : gears && gears.length > 0 ? (
              (gears as any[])
                .slice(0, 8)
                .map((gear: any) => <GearCard key={gear.id} gear={gear} />)
            ) : (
              <div className="col-span-full py-16 text-center text-muted-foreground">
                No gear listings currently active.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. HOW GEARUP WORKS SECTION (Lazy Loaded) */}
      <LazySection minHeight="420px">
        <section className="py-16 sm:py-24 bg-muted/40 border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              <Zap className="h-4 w-4" /> Seamless Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground max-w-xl mx-auto">
              Rent Quality Gear in 3 Simple Steps
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
              No long commitments. No storage lockers. Just grab the best equipment and get
              outdoors.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
              <div className="p-8 rounded-3xl border border-border bg-card shadow-xs relative">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xl flex items-center justify-center mb-6">
                  1
                </div>
                <h3 className="text-lg font-bold text-foreground">Find & Reserve</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Browse certified camping, water sports, cycling, and cinematography gear. Select
                  your adventure dates and reserve with instant confirmation.
                </p>
              </div>

              <div className="p-8 rounded-3xl border border-border bg-card shadow-xs relative">
                <div className="h-12 w-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 font-black text-xl flex items-center justify-center mb-6">
                  2
                </div>
                <h3 className="text-lg font-bold text-foreground">Pickup or Delivery</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Coordinate handoff directly with the verified local adventure shop or opt for
                  convenient trailhead drop-off ready for departure.
                </p>
              </div>

              <div className="p-8 rounded-3xl border border-border bg-card shadow-xs relative">
                <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-black text-xl flex items-center justify-center mb-6">
                  3
                </div>
                <h3 className="text-lg font-bold text-foreground">Adventure & Return</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Enjoy your journey with built-in zero-liability damage protection. Return when
                  finished and your security deposit is released automatically.
                </p>
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* 5. WHY CHOOSE GEARUP / VALUE PROPOSITIONS (Lazy Loaded) */}
      <LazySection minHeight="450px">
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-4 w-4" /> The GearUp Standard
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                  Why Thousands of Adventurers Trust GearUp
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  High-end gear is expensive and sits in closets 90% of the year. GearUp gives you
                  access to the world&apos;s best outdoor brands without ownership costs or
                  depreciation.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">
                        Certified Safety Inspections
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Tents, climbing ropes, kayaks, and avalanche gear undergo mandatory
                        multi-point sanitization and safety checks between rentals.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <RotateCcw className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">
                        Flexible Trailhead Dates
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Weather unpredictable? Easily extend rental periods or reschedule
                        reservation dates through your dashboard with zero penalty fees.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Zero-Dispute Protection</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Digital condition logging protects both renter and provider. Normal
                        wear-and-tear is fully covered by our platform insurance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphical Visual Card */}
              <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl bg-card">
                <Image
                  src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1000&auto=format&fit=crop&q=80"
                  alt="Outdoor Camping Experience"
                  width={800}
                  height={600}
                  className="w-full h-112 object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-card/90 backdrop-blur-md border border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        Over 14,000+ Expeditions
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Without a single equipment failure incident
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-500">99.8% Happy</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* 6. CURATED ADVENTURE GEAR KITS (Lazy Loaded) */}
      <LazySection minHeight="480px">
        <section className="py-16 sm:py-24 bg-muted/30 border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                <Award className="h-4 w-4" /> Ready-to-Go Bundles
              </div>
              <h2 className="text-3xl font-black text-foreground">
                Curated Adventure Destination Kits
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Save time with bundled kits selected by experienced mountain guides and
                cinematographers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {adventureKits.map((kit, idx) => (
                <div
                  key={idx}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={kit.image}
                      alt={kit.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-card/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-foreground">
                      {kit.tag}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-md text-xs font-extrabold shadow-sm">
                      {kit.price}
                    </div>
                  </div>

                  <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {kit.category}
                      </span>
                      <h3 className="font-bold text-sm text-foreground mt-1 line-clamp-1">
                        {kit.title}
                      </h3>
                      <ul className="mt-3 space-y-1.5 text-[11px] text-muted-foreground">
                        {kit.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-1.5 truncate">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="truncate">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <Link href="/gear" className="w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full rounded-xl text-xs font-semibold border-border hover:bg-muted"
                        >
                          Explore Kit Gear
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* 7. LIVE COMMUNITY STATISTICS & IMPACT (Lazy Loaded) */}
      <LazySection minHeight="240px">
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-border bg-linear-to-br from-emerald-950/20 via-card to-background p-8 sm:p-12 shadow-xl">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-border">
                <div className="space-y-1">
                  <div className="text-4xl sm:text-5xl font-black text-emerald-500">1,250+</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Verified Gear Items
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Inspected & ready for the trail
                  </p>
                </div>
                <div className="space-y-1 pt-6 lg:pt-0">
                  <div className="text-4xl sm:text-5xl font-black text-teal-500">45+</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Local Shop Providers
                  </div>
                  <p className="text-[11px] text-muted-foreground">Certified outdoor hubs</p>
                </div>
                <div className="space-y-1 pt-6 lg:pt-0">
                  <div className="text-4xl sm:text-5xl font-black text-cyan-500">14,200+</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Successful Expeditions
                  </div>
                  <p className="text-[11px] text-muted-foreground">Zero gear failure incidents</p>
                </div>
                <div className="space-y-1 pt-6 lg:pt-0">
                  <div className="text-4xl sm:text-5xl font-black text-amber-500">99.8%</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Satisfaction Rating
                  </div>
                  <p className="text-[11px] text-muted-foreground">Verified customer reviews</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* 8. VERIFIED CUSTOMER REVIEWS & TESTIMONIALS (Lazy Loaded) */}
      <LazySection minHeight="400px">
        <section className="py-16 sm:py-24 bg-muted/40 border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                <Users className="h-4 w-4" /> Community Stories
              </div>
              <h2 className="text-3xl font-black text-foreground">What Trailblazers Are Saying</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Real feedback from climbers, weekend campers, and professional guides.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-foreground leading-relaxed italic">
                    &quot;Rented a 4-season mountaineering tent and crampons for Mount Rainier.
                    Everything was immaculately sanitized, tagged, and ready at the Seattle partner
                    shop. Saved me over $1,200!&quot;
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                  <div className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xs">
                    EM
                  </div>
                  <div>
                    <div className="font-bold text-xs text-foreground">Elena Mitchell</div>
                    <div className="text-[10px] text-muted-foreground">Pacific Northwest Hiker</div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-foreground leading-relaxed italic">
                    &quot;GearUp enabled our college group to kayak the Rogue River without having
                    to haul heavy boats across three state borders. Trailhead drop-off was on-time
                    to the minute.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                  <div className="h-9 w-9 rounded-full bg-teal-500/20 text-teal-500 flex items-center justify-center font-bold text-xs">
                    CL
                  </div>
                  <div>
                    <div className="font-bold text-xs text-foreground">Chloe Lin</div>
                    <div className="text-[10px] text-muted-foreground">Water Sports Enthusiast</div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-foreground leading-relaxed italic">
                    &quot;As a professional documentary filmmaker, having access to 4K drones
                    on-demand without the luggage hassle of commercial flying is revolutionary.
                    Smooth return and immediate deposit release.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                  <div className="h-9 w-9 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center font-bold text-xs">
                    DS
                  </div>
                  <div>
                    <div className="font-bold text-xs text-foreground">Daniel Santos</div>
                    <div className="text-[10px] text-muted-foreground">Outdoor Cinematographer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* 9. AI ADVENTURE GEAR FINDER SPOTLIGHT (Lazy Loaded) */}
      <LazySection minHeight="380px">
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-emerald-500/30 bg-linear-to-r from-emerald-950/40 via-card to-background p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI-Powered Feature Spotlight</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-foreground">
                  Meet Your 24/7 AI Adventure Concierge
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Not sure what tent size, climbing rating, or drone specs your trip requires? Our
                  conversational AI assistant analyzes your destination, trail conditions, skill
                  level, and budget to prescribe the optimal gear list.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link href="/gear">
                    <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md">
                      <span>Try Smart Filter</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="rounded-xl border-border hover:bg-muted text-xs font-semibold cursor-pointer"
                    onClick={() => {
                      const aiBtn = document.querySelector(
                        'button[aria-label="Open GearUp AI Assistant"]',
                      ) as HTMLElement;
                      aiBtn?.click();
                    }}
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
                    <span>Launch AI Concierge Now</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* 10. PROVIDER MONETIZATION CTA BANNER (Lazy Loaded) */}
      <LazySection minHeight="260px">
        <section className="py-16 sm:py-20 bg-emerald-900 text-white relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Outfitter & Shop Partnership
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Turn Idle Gear into Monthly Rental Revenue
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Join verified mountain shops and outfitters earning $2,500+ every month with
                automated bookings, security deposits, and insurance protection.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/register">
                <Button
                  size="lg"
                  className="rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs px-6 shadow-xl cursor-pointer"
                >
                  <span>Become a Verified Provider</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-emerald-400/40 bg-emerald-800/40 hover:bg-emerald-800/60 text-white font-semibold text-xs px-5 cursor-pointer"
                >
                  <span>Provider Protection Policy</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </LazySection>

      {/* 11. FREQUENTLY ASKED QUESTIONS ACCORDION (Lazy Loaded) */}
      <LazySection minHeight="480px">
        <section className="py-16 sm:py-24 border-t border-border">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-lg mx-auto mb-12">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                <HelpCircle className="h-4 w-4" /> Got Questions?
              </div>
              <h2 className="text-3xl font-black text-foreground">Frequently Asked Inquiries</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Everything you need to know about reserving, security deposits, and handoffs.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-border bg-card overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-foreground hover:text-emerald-500 transition cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-4 ${
                          isOpen ? 'rotate-180 text-emerald-500' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </LazySection>

      {/* 12. NEWSLETTER & SEASONAL PERKS (Lazy Loaded) */}
      <LazySection minHeight="280px">
        <section className="py-16 sm:py-20 bg-muted/40 border-t border-border">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-black text-foreground">Get Notified on New Gear Drops</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Subscribe for seasonal equipment updates, member rental discounts, and backcountry
              guides.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 h-12 rounded-xl border border-border bg-background px-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Button
                type="submit"
                className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 cursor-pointer shadow-sm"
              >
                <span>Subscribe</span>
                <Send className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </form>
            <span className="text-[10px] text-muted-foreground block mt-3">
              No spam. Unsubscribe at any time with 1 click.
            </span>
          </div>
        </section>
      </LazySection>
    </div>
  );
}
