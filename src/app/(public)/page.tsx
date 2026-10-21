'use client';

import { AISearchAutocomplete } from '@/components/shared/ai-search-autocomplete';
import { GearCard, GearCardSkeleton } from '@/components/shared/gear-card';
import { Button } from '@/components/ui/button';
import { useCategories, useGears } from '@/hooks/use-gear';
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
    toast.success('🎉 You have subscribed to GearUp Adventure Drops!');
    setNewsletterEmail('');
  };

  const faqs = [
    {
      q: 'How does the rental duration and daily rate work?',
      a: 'Daily rates are calculated on a 24-hour cycle from your chosen start date and time. For example, picking up on Friday morning and returning Sunday morning is billed as a 2-day rental with no hidden fees.',
    },
    {
      q: 'How and when is the security deposit refunded?',
      a: 'Security deposits are held as a pre-authorization or temporary hold. Once your equipment is returned to the provider and inspected for standard condition, the deposit is released to your account within 24 hours.',
    },
    {
      q: 'What happens if equipment gets accidentally damaged?',
      a: 'Every reservation on GearUp includes our standard Damage Protection policy, covering minor wear, trail scratches, and accidental damage. You are only liable in cases of gross negligence or deliberate damage.',
    },
    {
      q: 'Can I cancel or reschedule my rental booking?',
      a: 'Yes, cancellations made up to 48 hours prior to your scheduled pickup are 100% free with an immediate full refund. Rescheduling is easy through your Customer Dashboard.',
    },
    {
      q: 'How do I become a verified GearUp Provider?',
      a: 'Anyone with quality outdoor or photography gear can sign up as a Provider. After basic identity and equipment verification, you can set your own rates, manage incoming orders, and earn 85% of every rental.',
    },
  ];

  const adventureKits = [
    {
      title: 'High Alpine Summit Kit',
      category: 'Climbing & Mountaineering',
      items: 'Petzl Harness, Dynamic Ropes, Crampons & Ice Axe',
      image:
        'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&auto=format&fit=crop&q=80',
      price: '$85/day',
      tag: 'Extreme Terrain',
    },
    {
      title: 'Coastal Water Expeditions',
      category: 'Water Sports',
      items: 'Touring Kayak, Red Paddle Inflatable SUP & Life Vest',
      image:
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
      price: '$65/day',
      tag: 'Ocean & Lakes',
    },
    {
      title: '4K Wilderness Cinematography',
      category: 'Photography & Drone Gear',
      items: 'Santa Cruz 4K Stabilized Drone, 3-Axis Gimbal & ND Filters',
      image:
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
      price: '$95/day',
      tag: 'Creators Choice',
    },
    {
      title: 'Backcountry 3-Day Trek',
      category: 'Camping & Hiking',
      items: 'Ultralight 4-Person Tent, 65L Expedition Pack & Jetboil',
      image:
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80',
      price: '$55/day',
      tag: 'Most Popular',
    },
  ];

  return (
    <div className="flex flex-col w-full scroll-smooth">
      {/* 1. HERO SECTION (60-70% screen height) */}
      <section className="relative min-h-[65vh] max-h-[75vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=80"
            alt="Scenic Mountain Backcountry"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-slate-950/70 to-slate-950/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center text-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Over 1,200+ Inspected Adventure Gear Items Ready to Rent</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl">
            Rent Pro Outdoor Gear.{' '}
            <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Explore Without Limits.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
            Premium camping, climbing, paddling, biking, and 4K aerial photography equipment.
            Verified local providers, seamless pickup, zero ownership hassle.
          </p>

          {/* Interactive AI Search Autocomplete Component */}
          <div className="w-full max-w-2xl mt-8">
            <AISearchAutocomplete />
          </div>

          {/* Quick Filter Activity Badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-5 text-xs">
            <span className="text-slate-400 py-1">Popular right now:</span>
            {[
              '4-Person Tent',
              'Inflatable SUP',
              '4K Drone',
              'Gravel Trail Bike',
              'Petzl Harness',
            ].map((item, idx) => (
              <Link
                key={idx}
                href={`/gear?search=${encodeURIComponent(item)}`}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/15 transition backdrop-blur-md cursor-pointer"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Clear visual flow indicator */}
          <a
            href="#categories"
            className="mt-8 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition animate-bounce"
          >
            <span>Explore Categories Below</span>
            <ChevronDown className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SECTION */}
      <section id="categories" className="py-16 sm:py-20 bg-muted/30 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                <Compass className="h-4 w-4" /> Adventure Disciplines
              </div>
              <h2 className="text-3xl font-black text-foreground">Explore by Outdoor Category</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Find purpose-built equipment maintained to peak manufacturer safety specifications.
              </p>
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

      {/* 4. HOW GEARUP WORKS SECTION */}
      <section className="py-16 sm:py-24 bg-muted/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
            <Zap className="h-4 w-4" /> Seamless Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground max-w-xl mx-auto">
            Rent Quality Gear in 3 Simple Steps
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
            No long commitments. No storage lockers. Just grab the best equipment and get outdoors.
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

      {/* 5. WHY CHOOSE GEARUP / VALUE PROPOSITIONS */}
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
                      100% Safety Inspected Equipment
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Ropes, harnesses, and kayaks are tested for structural integrity prior to
                      every rental.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      Damage Protection Included
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Minor trail wear, scratches, and weather exposure are covered with zero extra
                      fees.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      Flexible Free Cancellation
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Weather turned sour? Cancel up to 48 hours before reservation with immediate
                      full refund.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/about">
                  <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs">
                    Learn More About Our Mission
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-border shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&auto=format&fit=crop&q=80"
                alt="Backpacker in Mountain Landscape"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-card/90 backdrop-blur-md border border-border/60">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-foreground">
                      Over $2.4M Saved in Gear Costs
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Join our circular outdoor economy
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-500">99.8% Happy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CURATED ADVENTURE GEAR KITS */}
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
                <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                  <Image
                    src={kit.image}
                    alt={kit.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white">
                      {kit.tag}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-emerald-600/90 text-white px-2.5 py-0.5 text-[10px] font-bold">
                      {kit.price}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                      {kit.category}
                    </span>
                    <h3 className="font-bold text-sm text-foreground mt-1">{kit.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{kit.items}</p>
                  </div>
                  <div className="pt-4 mt-3 border-t border-border flex items-center justify-between">
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

      {/* 7. LIVE COMMUNITY STATISTICS & IMPACT */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-linear-to-br from-emerald-950/20 via-card to-background p-8 sm:p-12 shadow-xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-border">
              <div className="space-y-1">
                <div className="text-4xl sm:text-5xl font-black text-emerald-500">1,250+</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Verified Gear Items
                </div>
                <p className="text-[11px] text-muted-foreground">Inspected & ready for the trail</p>
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

      {/* 8. VERIFIED CUSTOMER REVIEWS & TESTIMONIALS */}
      <section className="py-16 sm:py-24 bg-muted/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              <Users className="h-4 w-4" /> Community Stories
            </div>
            <h2 className="text-3xl font-black text-foreground">Reviewed by Real Adventurers</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Read how explorers save money and tackle tougher trails with GearUp.
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
                  &quot;Rented a 4-person tent and backpacking stove for an ascent of Mount Rainier.
                  Gear was in immaculate condition, cleaned, and checked. Saved us over $1,000
                  compared to buying!&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                <div className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xs">
                  MJ
                </div>
                <div>
                  <div className="font-bold text-xs text-foreground">Marcus Jenkins</div>
                  <div className="text-[10px] text-muted-foreground">Cascades Mountaineer</div>
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
                  &quot;The Red Paddle inflatable paddleboard was pristine and came with pump and
                  leash. Trailhead pickup made our Lake Tahoe weekend totally painless. Definitely
                  renting again.&quot;
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
                  on-demand without the luggage hassle of commercial flying is revolutionary. Smooth
                  return and immediate deposit release.&quot;
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

      {/* 9. AI ADVENTURE GEAR FINDER SPOTLIGHT */}
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

      {/* 10. BECOME A GEAR PROVIDER BANNER */}
      <section className="py-16 sm:py-20 bg-muted/20 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-8 sm:p-12 rounded-3xl bg-slate-950 text-white border border-border shadow-2xl">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Award className="h-4 w-4" /> Earn From Equipment
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Turn Idle Outdoor Gear Into Recurring Revenue
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Have kayaks, tents, or camera gear sitting unused? List on GearUp with guaranteed
                damage protection, custom rental pricing, and payouts directly to your bank account.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg"
                >
                  Register as Provider
                </Button>
              </Link>
              <Link href="/help">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white text-sm"
                >
                  Provider FAQ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              <HelpCircle className="h-4 w-4" /> Clear Answers
            </div>
            <h2 className="text-3xl font-black text-foreground">Frequently Asked Questions</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Everything you need to know about booking, security deposits, and insurance.
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
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-500' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-3 animate-in fade-in-0 duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. NEWSLETTER & SEASONAL PERKS */}
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
    </div>
  );
}
