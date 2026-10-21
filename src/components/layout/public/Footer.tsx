'use client';

import { Footer as SharedFooter } from '@/components/shared/footer';

export function PublicFooter() {
  return <SharedFooter />;
}

export const Footer = PublicFooter;
export default PublicFooter;
