'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Compass, Sparkles } from 'lucide-react';
import Link from 'next/link';
import RegisterForm from '../_components/RegisterForm';

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-lg border-border bg-card/95 text-card-foreground shadow-2xl backdrop-blur-xl rounded-2xl">
      <CardHeader className="space-y-1 text-center pb-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-2 border border-emerald-500/20">
          <Sparkles className="h-7 w-7" />
        </div>
        <CardTitle className="text-2xl font-black tracking-tight text-foreground">
          Create Your <span className="text-emerald-500">GearUp</span> Account
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Join thousands of outdoor enthusiasts renting & sharing verified adventure gear.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <RegisterForm />
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 text-center text-xs text-muted-foreground border-t border-border/60 pt-4">
        <div>
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-semibold text-emerald-500 hover:text-emerald-400 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
