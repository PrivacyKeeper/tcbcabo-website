'use client';

import { useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Waves, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

export function CaptainLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (!email || !password) { toast.error('Enter credentials'); return; }
    setLoading(true);
    try {
      const res = await signIn('credentials', { email, password, redirect: false });
      if (res?.error) {
        toast.error('Invalid credentials');
      } else {
        router.replace('/captain/dashboard');
      }
    } catch {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  }, [email, password, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Waves className="w-6 h-6 text-primary" />
            <span className="font-display text-2xl font-bold tracking-tight">
              <span className="text-gold-gradient">Striped World</span>
              <span className="text-muted-foreground font-normal ml-1.5 text-base">Captain</span>
            </span>
          </div>
          <p className="text-muted-foreground text-sm">Sign in to manage reports &amp; bookings</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border/30 rounded-lg p-6 space-y-4">
          <div>
            <Label htmlFor="email" className="text-xs text-muted-foreground mb-1 block">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e: any) => setEmail(e?.target?.value ?? '')} placeholder="captain@stripedworldcharters.com" />
          </div>
          <div>
            <Label htmlFor="password" className="text-xs text-muted-foreground mb-1 block">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e: any) => setPassword(e?.target?.value ?? '')} placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</> : <><Lock className="w-4 h-4 mr-2" /> Sign In</>}
          </Button>
        </form>
      </div>
    </div>
  );
}
