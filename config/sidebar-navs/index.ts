import { adminLinks } from './adminSidebarItems';
import { customerLinks } from './customerSidebarItems';
import { providerLinks } from './providerSidebarItems';

export const sidebarMenuItems = {
  CUSTOMER: customerLinks,
  PROVIDER: providerLinks,
  ADMIN: adminLinks,
} as const;
