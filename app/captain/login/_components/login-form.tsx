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
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (!code) { toast.error('Enter your access code'); return; }
    setLoading(true);
    try {
      const res = await signIn('credentials', { code, redirect: false });
      if (res?.error) {
        toast.error('Invalid access code');
      } else {
        router.replace('/captain/dashboard');
      }
    } catch {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  }, [code, router]);

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
          <p className="text-muted-foreground text-sm">Enter your access code to manage reports, reviews &amp; bookings</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border/30 rounded-lg p-6 space-y-4">
          <div>
            <Label htmlFor="code" className="text-xs text-muted-foreground mb-1 block">Access Code</Label>
            <Input id="code" type="password" autoComplete="off" value={code} onChange={(e: any) => setCode(e?.target?.value ?? '')} placeholder="Enter shared access code" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</> : <><Lock className="w-4 h-4 mr-2" /> Sign In</>}
          </Button>
        </form>
      </div>
    </div>
  );
}
