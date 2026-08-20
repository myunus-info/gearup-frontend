import Link from 'next/link';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import LoginForm from '../_components/LoginForm';

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md border-slate-800 bg-slate-900/90 text-slate-100 shadow-2xl backdrop-blur-xl">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-2">
          <Lock className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Sign in to GearUp</CardTitle>
        <CardDescription className="text-xs text-slate-400">
          Enter your credentials or click a demo profile below to test instantly.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
        <div>
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-semibold text-emerald-400 hover:underline">
            Register here
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
