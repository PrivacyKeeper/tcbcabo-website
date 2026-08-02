'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CalendarDays, Check, DollarSign, Clock, Users, AlertCircle, Loader2 } from 'lucide-react';
import { CHARTER_PACKAGES, CASH_FLOW_PACKAGE } from '@/lib/charter-data';

type Boat = {
  id: string;
  name: string;
  slug: string;
  capacity: number | null;
  imageUrl: string | null;
};

const CHARTER_TYPES = [
  { key: 'fishing', label: 'Fishing Charter' },
  { key: 'whaleWatching', label: 'Whale Watching' },
  { key: 'sunset', label: 'Sunset Cruise' },
  { key: 'bachelor', label: 'Bachelor/Bachelorette' },
];

// Parse a blocked-date string (e.g. "2026-11-07T00:00:00.000Z") into a LOCAL
// date at midnight, using only the calendar day. This prevents the timezone
// shift where a UTC-midnight date renders as the previous day in the browser.
function parseBlockedDate(value: string): Date {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function BookingForm() {
  const searchParams = useSearchParams();
  const [boats, setBoats] = useState<Boat[]>([]);
  const [selectedBoatId, setSelectedBoatId] = useState('');
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [charterType, setCharterType] = useState('fishing');
  const [duration, setDuration] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [upgrade, setUpgrade] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/boats')
      .then((r) => r.json())
      .then((data: Boat[]) => {
        const activeBoats = Array.isArray(data) ? data : [];
        setBoats(activeBoats);

        const requestedSlug = searchParams.get('boat');
        const requestedBoat = activeBoats.find(
          (boat) => boat.slug === requestedSlug
        );

        setSelectedBoatId(
          requestedBoat?.id ?? activeBoats[0]?.id ?? ''
        );
      })
      .catch(() => {
        toast.error('Unable to load available boats.');
      });
  }, [searchParams]);

  const selectedBoat = boats.find(
    (boat) => boat.id === selectedBoatId
  );

  const isCashFlow =
    selectedBoat?.slug === 'cash-flow-26-angler';

  useEffect(() => {
    if (!selectedBoatId) {
      setBlockedDates([]);
      return;
    }

    fetch(`/api/calendar?boatId=${encodeURIComponent(selectedBoatId)}`)
      .then((r) => r.json())
      .then((dates: any) => {
        setBlockedDates(
          (dates ?? []).map((date: string) => parseBlockedDate(date))
        );
      })
      .catch(() => {
        setBlockedDates([]);
      });

    setSelectedDate(undefined);
  }, [selectedBoatId]);

  useEffect(() => {
    if (isCashFlow) {
      setCharterType('fishing');
    }

    const capacity = selectedBoat?.capacity ?? 1;
    setGuestCount((count) => Math.min(count, capacity));
  }, [isCashFlow, selectedBoat?.capacity]);

  const currentPackage = isCashFlow
    ? CASH_FLOW_PACKAGE
    : (CHARTER_PACKAGES as any)?.[charterType];

  const availableCharterTypes = isCashFlow
    ? CHARTER_TYPES.filter((type) => type.key === 'fishing')
    : CHARTER_TYPES;

  const options = currentPackage?.options ?? [];
  const maximumGuests = selectedBoat?.capacity ?? 1;

  // Auto-select first duration when charter type changes
  useEffect(() => {
    if (options?.length > 0) {
      setDuration(options[0]?.duration ?? '');
    }
    setUpgrade('');
  }, [charterType, isCashFlow]);

  const selectedOption = options?.find?.((o: any) => o?.duration === duration);
  const selectedUpgrade = (currentPackage?.upgrades ?? [])?.find?.((u: any) => u?.name === upgrade);
  const basePrice = selectedOption?.price ?? 0;
  const additionalGuests = 0;
  const upgradePrice = selectedUpgrade?.price ?? 0;
  const totalPrice = basePrice + additionalGuests + upgradePrice;
  const daysUntilCharter = selectedDate
    ? Math.ceil((selectedDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const payInFull = daysUntilCharter !== null && daysUntilCharter < 30;
  const depositAmount = payInFull ? totalPrice : Math.round(totalPrice * 0.5 * 100) / 100;

  const handleSubmit = useCallback(async () => {
    if (!selectedBoatId) { toast.error('Please select a boat'); return; }
    if (!selectedDate) { toast.error('Please select a date'); return; }
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all contact fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boatId: selectedBoatId,
          charterType,
          charterDuration: duration,
          // Send the selected calendar day as UTC midnight so the server
          // records the exact day the guest picked, regardless of timezone.
          charterDate: new Date(
            Date.UTC(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate()
            )
          ).toISOString(),
          guestName: formData.name,
          guestEmail: formData.email,
          guestPhone: formData.phone,
          guestCount,
          upgrades: upgrade || null,
          notes: formData.notes || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 409) {
          toast.error(err?.error || 'That date is no longer available. Please choose another day.');
          setSelectedDate(undefined);
          // Refresh blocked dates so the calendar updates immediately
          fetch(`/api/calendar?boatId=${encodeURIComponent(selectedBoatId)}`).then((r) => r.json()).then((dates: any) => {
            setBlockedDates((dates ?? []).map((d: string) => parseBlockedDate(d)));
          }).catch(() => {});
          return;
        }
        throw new Error('Failed');
      }

      // Booking created — now start Stripe checkout for the deposit/full payment.
      const booking = await res.json().catch(() => null);
      if (booking?.id) {
        try {
          const checkoutRes = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId: booking.id }),
          });
          if (checkoutRes.ok) {
            const { url } = await checkoutRes.json();
            if (url) {
              window.location.href = url;
              return;
            }
          }
        } catch {
          // fall through to the request-received screen below
        }
      }

      // Payment not enabled yet (or checkout unavailable) — show request screen.
      setSubmitted(true);
      toast.success('Booking request submitted!');
    } catch {
      toast.error('Something went wrong. Please try again or call us.');
    } finally {
      setSubmitting(false);
    }
  }, [selectedBoatId, selectedDate, formData, charterType, duration, guestCount, upgrade]);

  if (submitted) {
    return (
      <div className="max-w-[600px] mx-auto px-4 sm:px-6 py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">Booking Request Received!</h2>
          <p className="text-muted-foreground mb-2">
            We&apos;ll contact you shortly with payment instructions for the <strong className="text-primary">${depositAmount.toLocaleString()}</strong> {payInFull ? 'full payment' : 'deposit'}.
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            Your date is <strong>not confirmed</strong> until payment is received.{!payInFull && (<> Balance of <strong className="text-primary">${(totalPrice - depositAmount).toLocaleString()}</strong> is due 30 days before your charter.</>)}
          </p>
          <Button onClick={() => { setSubmitted(false); setSelectedDate(undefined); setFormData({ name: '', email: '', phone: '', notes: '' }); }}>
            Book Another Charter
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-10">
        <p className="text-primary font-mono text-sm tracking-[0.15em] uppercase mb-2">Reserve Your Day</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Book a <span className="text-gold-gradient">Charter</span>
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto text-sm">
          Select your charter type, choose an available date, and we&apos;ll send deposit instructions to confirm.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Charter selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Boat selection */}
          <div>
            <Label className="text-sm font-semibold uppercase tracking-wider text-primary mb-3 block">
              Choose Your Boat
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {boats.map((boat) => (
                <button
                  key={boat.id}
                  type="button"
                  onClick={() => setSelectedBoatId(boat.id)}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    selectedBoatId === boat.id
                      ? 'bg-primary/15 border-primary/50'
                      : 'bg-card border-border/30 hover:border-primary/20'
                  }`}
                >
                  <span className="block font-semibold">{boat.name}</span>
                  <span className="block text-xs text-muted-foreground mt-1">
                    Up to {boat.capacity ?? 1} guests
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Charter type */}
          <div>
            <Label className="text-sm font-semibold uppercase tracking-wider text-primary mb-3 block">Charter Type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availableCharterTypes.map((ct: any) => (
                <button
                  key={ct?.key}
                  onClick={() => setCharterType(ct?.key ?? 'fishing')}
                  className={`p-3 rounded-lg text-sm font-medium transition-all border ${
                    charterType === ct?.key
                      ? 'bg-primary/15 border-primary/50 text-primary'
                      : 'bg-card border-border/30 text-muted-foreground hover:border-primary/20'
                  }`}
                >
                  {ct?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          {options?.length > 1 && (
            <div>
              <Label className="text-sm font-semibold uppercase tracking-wider text-primary mb-3 block">Duration</Label>
              <div className="grid grid-cols-3 gap-2">
                {options?.map((opt: any) => (
                  <button
                    key={opt?.duration}
                    onClick={() => setDuration(opt?.duration ?? '')}
                    className={`p-3 rounded-lg text-center transition-all border ${
                      duration === opt?.duration
                        ? 'bg-primary/15 border-primary/50'
                        : 'bg-card border-border/30 hover:border-primary/20'
                    }`}
                  >
                    <span className="block font-semibold text-sm">{opt?.duration}</span>
                    <span className="block text-primary font-mono text-lg">${(opt?.price ?? 0).toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upgrades */}
          {(currentPackage?.upgrades?.length ?? 0) > 0 && (
            <div>
              <Label className="text-sm font-semibold uppercase tracking-wider text-primary mb-3 block">Upgrades (Optional)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => setUpgrade('')}
                  className={`p-3 rounded-lg text-sm text-left transition-all border ${
                    !upgrade ? 'bg-primary/15 border-primary/50 text-primary' : 'bg-card border-border/30 text-muted-foreground hover:border-primary/20'
                  }`}
                >
                  No upgrade
                </button>
                {(currentPackage?.upgrades ?? []).map((up: any) => (
                  <button
                    key={up?.name}
                    onClick={() => setUpgrade(up?.name ?? '')}
                    className={`p-3 rounded-lg text-left transition-all border ${
                      upgrade === up?.name
                        ? 'bg-primary/15 border-primary/50'
                        : 'bg-card border-border/30 hover:border-primary/20'
                    }`}
                  >
                    <span className="block font-semibold text-sm">{up?.name} <span className="text-primary">+${(up?.price ?? 0).toLocaleString()}</span></span>
                    <span className="block text-muted-foreground text-xs">{up?.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Guest count */}
          <div>
            <Label className="text-sm font-semibold uppercase tracking-wider text-primary mb-3 block">Number of Guests</Label>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="border-border/50">–</Button>
              <span className="font-mono text-xl w-12 text-center">{guestCount}</span>
              <Button variant="outline" size="sm" onClick={() => setGuestCount(Math.min(maximumGuests, guestCount + 1))} className="border-border/50">+</Button>
              <span className="text-xs text-muted-foreground">Max 6 guests — larger groups by arrangement with the captain</span>
            </div>
          </div>

          {/* Calendar */}
          <div>
            <Label className="text-sm font-semibold uppercase tracking-wider text-primary mb-3 block">Select Date</Label>
            <div className="bg-card border border-border/30 rounded-lg p-4 inline-block">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={[
                  { before: new Date() },
                  { after: (() => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d; })() },
                  ...(blockedDates ?? []).map((d: Date) => d),
                ]}
                className=""
              />
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-primary/20 inline-block" /> Selected</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-muted inline-block" /> Booked</span>
            </div>
          </div>

          {/* Contact info */}
          <div>
            <Label className="text-sm font-semibold uppercase tracking-wider text-primary mb-3 block">Contact Information</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name" className="text-xs text-muted-foreground mb-1 block">Full Name *</Label>
                <Input id="name" value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e?.target?.value ?? '' })} placeholder="John Smith" />
              </div>
              <div>
                <Label htmlFor="email" className="text-xs text-muted-foreground mb-1 block">Email *</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e: any) => setFormData({ ...formData, email: e?.target?.value ?? '' })} placeholder="john@example.com" />
              </div>
              <div>
                <Label htmlFor="phone" className="text-xs text-muted-foreground mb-1 block">Phone *</Label>
                <Input id="phone" type="tel" value={formData.phone} onChange={(e: any) => setFormData({ ...formData, phone: e?.target?.value ?? '' })} placeholder="+1 (555) 123-4567" />
              </div>
            </div>
            <div className="mt-3">
              <Label htmlFor="notes" className="text-xs text-muted-foreground mb-1 block">Special Requests</Label>
              <Textarea id="notes" value={formData.notes} onChange={(e: any) => setFormData({ ...formData, notes: e?.target?.value ?? '' })} placeholder="Dietary restrictions, celebrations, etc." rows={3} />
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border/30 rounded-lg p-6 sticky top-24">
            <h3 className="font-display text-lg font-semibold mb-4">Booking Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Boat</span>
                <span className="text-right">{selectedBoat?.name ?? 'Select a boat'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Charter</span>
                <span>{currentPackage?.name ?? ''}</span>
              </div>
              {duration && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{duration}</span>
                </div>
              )}
              {selectedDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guests</span>
                <span>{guestCount}</span>
              </div>
              {upgrade && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Upgrade</span>
                  <span className="text-primary">{upgrade}</span>
                </div>
              )}

              <div className="border-t border-border/50 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base price</span>
                  <span>${basePrice.toLocaleString()}</span>
                </div>
                {additionalGuests > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Extra guests</span>
                    <span>+${additionalGuests}</span>
                  </div>
                )}
                {upgradePrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Upgrade</span>
                    <span>+${upgradePrice.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-border/50 pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-gold-gradient">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex justify-between font-semibold">
                  <span className="flex items-center gap-1 text-primary">
                    <DollarSign className="w-4 h-4" /> {payInFull ? 'Due now (paid in full)' : 'Deposit (50%)'}
                  </span>
                  <span className="text-primary">${depositAmount.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{payInFull ? 'Charter is within 30 days — full payment due at booking' : `Balance of $${(totalPrice - depositAmount).toLocaleString()} due 30 days before charter`}</p>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              size="lg"
              onClick={handleSubmit}
              disabled={submitting || !selectedDate}
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
              ) : (
                <><CalendarDays className="w-4 h-4 mr-2" /> Request Booking</>
              )}
            </Button>

            <div className="flex items-start gap-2 mt-4 text-xs text-muted-foreground">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Your date is not confirmed until the deposit is received. We&apos;ll contact you with payment instructions.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
