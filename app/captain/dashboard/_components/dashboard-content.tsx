'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Waves, LogOut, Fish, Plus, Send, Calendar, Thermometer, MapPin,
  Sparkles, Loader2, Check, ChevronDown, Anchor, ClipboardList,
  CalendarX, Trash2, Lock
} from 'lucide-react';

const SPECIES_OPTIONS = ['Blue Marlin', 'Striped Marlin', 'Yellowfin Tuna', 'Dorado', 'Wahoo', 'Roosterfish', 'Sailfish', 'Swordfish', 'Skipjack'];

export function DashboardContent() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'report' | 'bookings' | 'calendar'>('report');
  const [reports, setReports] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Calendar / blackout dates
  const [blocked, setBlocked] = useState<any[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newReason, setNewReason] = useState('');
  const [savingBlackout, setSavingBlackout] = useState(false);

  // Report form
  const [title, setTitle] = useState('');
  const [conditions, setConditions] = useState('');
  const [waterTemp, setWaterTemp] = useState('');
  const [species, setSpecies] = useState<string[]>([]);
  const [catches, setCatches] = useState('');
  const [highlights, setHighlights] = useState('');
  const [hotspots, setHotspots] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/captain/login');
    }
  }, [status, router]);

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      setReports(data ?? []);
    } catch {}
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data ?? []);
      }
    } catch {}
  }, []);

  const fetchBlocked = useCallback(async () => {
    try {
      const res = await fetch('/api/calendar?detailed=true');
      if (res.ok) {
        const data = await res.json();
        setBlocked(data ?? []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchReports();
      fetchBookings();
      fetchBlocked();
    }
  }, [status, fetchReports, fetchBookings, fetchBlocked]);

  const addBlackout = useCallback(async () => {
    if (!newDate) { toast.error('Pick a date'); return; }
    setSavingBlackout(true);
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate, reason: newReason }),
      });
      if (res.ok) {
        toast.success('Date blocked off');
        setNewDate(''); setNewReason('');
        fetchBlocked();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error ?? 'Failed to block date');
      }
    } catch {
      toast.error('Failed to block date');
    } finally {
      setSavingBlackout(false);
    }
  }, [newDate, newReason, fetchBlocked]);

  const removeBlackout = useCallback(async (date: string) => {
    try {
      const res = await fetch('/api/calendar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      });
      if (res.ok) {
        toast.success('Date opened back up');
        fetchBlocked();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error ?? 'Failed to remove');
      }
    } catch {
      toast.error('Failed to remove');
    }
  }, [fetchBlocked]);

  const toggleSpecies = useCallback((s: string) => {
    setSpecies((prev: string[]) =>
      (prev ?? []).includes(s) ? (prev ?? []).filter((x: string) => x !== s) : [...(prev ?? []), s]
    );
  }, []);

  const submitReport = useCallback(async () => {
    if (!title) { toast.error('Add a title'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, conditions, waterTemp, species, catches, highlights, hotspots }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Report posted!');
      setTitle(''); setConditions(''); setWaterTemp(''); setSpecies([]); setCatches(''); setHighlights(''); setHotspots('');
      fetchReports();
    } catch {
      toast.error('Failed to post report');
    } finally {
      setSubmitting(false);
    }
  }, [title, conditions, waterTemp, species, catches, highlights, hotspots, fetchReports]);

  const toggleDeposit = useCallback(async (id: string, currentVal: boolean) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ depositPaid: !currentVal, status: !currentVal ? 'confirmed' : 'pending' }),
      });
      if (res.ok) {
        toast.success(!currentVal ? 'Deposit confirmed – date blocked!' : 'Deposit unmarked');
        fetchBookings();
      }
    } catch {
      toast.error('Failed to update');
    }
  }, [fetchBookings]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (status !== 'authenticated') return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-optimized header */}
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="max-w-[800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-lg">
              <span className="text-gold-gradient">Striped World</span>
              <span className="text-muted-foreground font-normal ml-1 text-sm">Captain</span>
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/captain/login' })}>
            <LogOut className="w-4 h-4 mr-1" /> Out
          </Button>
        </div>
      </header>

      <div className="max-w-[800px] mx-auto px-4 py-4">
        {/* Tab toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'report' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/30 text-muted-foreground'
            }`}
          >
            <Fish className="w-4 h-4" /> Fishing Report
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'bookings' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/30 text-muted-foreground'
            }`}
          >
            <ClipboardList className="w-4 h-4" /> Bookings
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'calendar' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/30 text-muted-foreground'
            }`}
          >
            <CalendarX className="w-4 h-4" /> Calendar
          </button>
        </div>

        {activeTab === 'report' && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> New Fishing Report
            </h2>
            <p className="text-muted-foreground text-sm">Quick post from your phone — tap species caught, add a few details, hit send.</p>

            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Report Title *</Label>
              <Input value={title} onChange={(e: any) => setTitle(e?.target?.value ?? '')} placeholder="e.g. Hot Marlin Bite Today!" />
            </div>

            {/* Species quick-select */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Species Caught (tap to select)</Label>
              <div className="flex flex-wrap gap-2">
                {SPECIES_OPTIONS?.map((s: string) => (
                  <button
                    key={s}
                    onClick={() => toggleSpecies(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      (species ?? []).includes(s)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border/30 text-muted-foreground'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Conditions</Label>
                <Input value={conditions} onChange={(e: any) => setConditions(e?.target?.value ?? '')} placeholder="Calm seas, clear" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Water Temp</Label>
                <Input value={waterTemp} onChange={(e: any) => setWaterTemp(e?.target?.value ?? '')} placeholder="78°F" />
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Catches</Label>
              <Input value={catches} onChange={(e: any) => setCatches(e?.target?.value ?? '')} placeholder="2 marlin released, 3 tuna" />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Hotspots</Label>
              <Input value={hotspots} onChange={(e: any) => setHotspots(e?.target?.value ?? '')} placeholder="Gordo Banks, 11 Spot" />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Highlights</Label>
              <Textarea value={highlights} onChange={(e: any) => setHighlights(e?.target?.value ?? '')} placeholder="Quick summary of the day..." rows={3} />
            </div>

            <Button onClick={submitReport} disabled={submitting} className="w-full" size="lg">
              {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Posting...</> : <><Send className="w-4 h-4 mr-2" /> Post Report</>}
            </Button>

            {/* Recent reports */}
            {(reports?.length ?? 0) > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Recent Reports</h3>
                <div className="space-y-2">
                  {(reports ?? []).slice(0, 5).map((r: any) => (
                    <div key={r?.id} className="bg-card border border-border/30 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{r?.title}</span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {r?.date ? new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                        </span>
                      </div>
                      {(r?.species?.length ?? 0) > 0 && (
                        <p className="text-xs text-primary mt-1">{(r?.species ?? []).join(', ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" /> Bookings
            </h2>

            {(bookings?.length ?? 0) === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No bookings yet.</p>
            ) : (
              <div className="space-y-3">
                {(bookings ?? []).map((b: any) => (
                  <div key={b?.id} className={`bg-card border rounded-lg p-4 ${
                    b?.depositPaid ? 'border-primary/30' : 'border-border/30'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{b?.guestName}</p>
                        <p className="text-xs text-muted-foreground">{b?.charterType} {b?.charterDuration ? `• ${b.charterDuration}` : ''}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        b?.depositPaid ? 'bg-primary/15 text-primary' : 'bg-destructive/15 text-destructive'
                      }`}>
                        {b?.depositPaid ? 'Confirmed' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {b?.charterDate ? new Date(b.charterDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      </span>
                      <span>${(b?.totalPrice ?? 0).toLocaleString()}</span>
                      <span>{b?.guestCount ?? 1} guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">{b?.guestEmail}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{b?.guestPhone}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant={b?.depositPaid ? 'outline' : 'default'}
                        onClick={() => toggleDeposit(b?.id, b?.depositPaid)}
                        className="text-xs"
                      >
                        {b?.depositPaid ? (
                          <><Check className="w-3 h-3 mr-1" /> Deposit Paid</>
                        ) : (
                          'Mark Deposit Paid'
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <CalendarX className="w-5 h-5 text-primary" /> Block Off Dates
            </h2>
            <p className="text-muted-foreground text-sm">
              Block dates you're not available (personal days, maintenance, etc.). Blocked dates won't show as bookable on the site. Confirmed bookings appear here too but are locked.
            </p>

            {/* Add blackout */}
            <div className="bg-card border border-border/30 rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Date to block *</Label>
                <Input type="date" value={newDate} onChange={(e: any) => setNewDate(e?.target?.value ?? '')} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Reason (optional)</Label>
                <Input value={newReason} onChange={(e: any) => setNewReason(e?.target?.value ?? '')} placeholder="e.g. Maintenance, personal day" />
              </div>
              <Button onClick={addBlackout} disabled={savingBlackout} className="w-full">
                {savingBlackout ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Blocking...</> : <><Plus className="w-4 h-4 mr-2" /> Block This Date</>}
              </Button>
            </div>

            {/* Blocked list */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Blocked Dates</h3>
              {(blocked?.length ?? 0) === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-6">No dates blocked. All open for booking.</p>
              ) : (
                <div className="space-y-2">
                  {(blocked ?? []).map((d: any) => (
                    <div key={d?.date} className="bg-card border border-border/30 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-primary" />
                        <div>
                          <p className="font-medium text-sm">
                            {d?.date ? new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : ''}
                          </p>
                          <p className="text-xs text-muted-foreground">{d?.isBooking ? 'Confirmed booking' : (d?.reason ?? 'Blackout')}</p>
                        </div>
                      </div>
                      {d?.isBooking ? (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground"><Lock className="w-3 h-3" /> Locked</span>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => removeBlackout(d?.date)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
