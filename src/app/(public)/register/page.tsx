'use client';

import { RegisterForm } from '@/components/auth/RegisterForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Compass } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-md border-border bg-card/95 text-card-foreground shadow-2xl backdrop-blur-xl rounded-2xl">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-2 border border-emerald-500/20">
            <Compass className="h-7 w-7 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-foreground">
            Create an Account
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Join the outdoor rental network as an adventurer or gear provider.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-xl" />}>
            <RegisterForm />
          </Suspense>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 text-center text-xs text-muted-foreground border-t border-border/60 pt-4">
          <div>
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
