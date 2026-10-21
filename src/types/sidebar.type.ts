import type React from 'react';

export interface ISidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export type SidebarItem = ISidebarItem;
