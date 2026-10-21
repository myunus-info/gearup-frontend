import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import RegisterForm from '../_components/RegisterForm';

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-lg border-slate-800 bg-slate-900/90 text-slate-100 shadow-2xl backdrop-blur-xl">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-2">
          <Sparkles className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Create Your GearUp Account</CardTitle>
        <CardDescription className="text-xs text-slate-400">
          Join as an adventurer renting gear or as a shop provider listing inventory.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <RegisterForm />
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
        <div>
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-emerald-400 hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
