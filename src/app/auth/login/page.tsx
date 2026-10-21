'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Compass, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import LoginForm from '../_components/LoginForm';

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md border-border bg-card/95 text-card-foreground shadow-2xl backdrop-blur-xl rounded-2xl">
      <CardHeader className="space-y-1 text-center pb-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-2 border border-emerald-500/20">
          <Compass className="h-7 w-7 animate-pulse" />
        </div>
        <CardTitle className="text-2xl font-black tracking-tight text-foreground">
          Welcome to <span className="text-emerald-500">GearUp</span>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Rent premium outdoor and photography equipment from verified providers.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        {/* Demo Credentials Box */}
        <div className="rounded-xl border border-border/80 bg-muted/40 p-3 text-xs space-y-1.5 text-muted-foreground">
          <div className="flex items-center gap-1.5 font-semibold text-foreground text-[11px]">
            <KeyRound className="h-3.5 w-3.5 text-amber-500" />
            <span>Pre-Seeded Demo Accounts (Password: Password123!)</span>
          </div>
          <div className="grid grid-cols-1 gap-1 text-[11px] font-mono">
            <div>
              <span className="text-red-400 font-semibold">Admin:</span> admin@gearup.com
            </div>
            <div>
              <span className="text-amber-400 font-semibold">Provider:</span> provider@gearup.com
            </div>
            <div>
              <span className="text-emerald-400 font-semibold">Customer:</span> customer@gearup.com
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 text-center text-xs text-muted-foreground border-t border-border/60 pt-4">
        <div>
          Don&apos;t have an account yet?{' '}
          <Link
            href="/auth/register"
            className="font-semibold text-emerald-500 hover:text-emerald-400 hover:underline"
          >
            Create an account
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
