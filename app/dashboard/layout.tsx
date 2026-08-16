import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <h1>This is the DashboardLayout component</h1>
      <main>{children}</main>
    </div>
  );
}
