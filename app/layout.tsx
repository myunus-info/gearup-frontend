import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GearUp 🏋️ | Rent Sports & Outdoor Gear Instantly',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
