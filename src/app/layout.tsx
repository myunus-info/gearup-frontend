import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'GearUp | Rent Sports & Outdoor Adventure Gear Instantly',
    template: '%s | GearUp',
  },
  description:
    'Premium marketplace to rent camping, climbing, water sports, biking, and winter gear from verified local shops and adventure providers.',
  keywords: [
    'gear rental',
    'outdoor equipment',
    'sports gear',
    'kayak rental',
    'camping tent rental',
    'ski rental',
    'mountain bike rental',
  ],
  authors: [{ name: 'GearUp Team' }],
  openGraph: {
    title: 'GearUp | Rent Sports & Outdoor Adventure Gear Instantly',
    description:
      'Rent top-tier camping, biking, climbing, paddling, and photography equipment on-demand from trusted adventure providers.',
    type: 'website',
    locale: 'en_US',
    siteName: 'GearUp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GearUp | Rent Sports & Outdoor Adventure Gear Instantly',
    description: 'Rent top-tier outdoor equipment on-demand from trusted adventure providers.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={inter.className}>
        <main>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
