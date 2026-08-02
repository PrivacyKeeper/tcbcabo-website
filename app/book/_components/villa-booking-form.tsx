'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, Check, Loader2, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function VillaBookingForm() {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  async function handleSubmit() {
    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates.');
      return;
    }

    if (checkOutDate <= checkInDate) {
      toast.error('Check-out must be after check-in.');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all contact fields.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/villa-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkInDate,
          checkOutDate,
          guestName: formData.name,
          guestEmail: formData.email,
          guestPhone: formData.phone,
          guestCount,
          notes: formData.notes || null,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || 'Unable to submit request.');
      }

      setSubmitted(true);
      toast.success('Villa booking request submitted!');
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-[600px] px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Check className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mb-4 font-display text-2xl font-bold sm:text-3xl">
          Villa Request Received!
        </h2>
        <p className="mb-8 text-muted-foreground">
          We&apos;ll contact you regarding availability and next steps. Your
          stay is not confirmed until you receive confirmation.
        </p>
        <Button
          onClick={() => {
            setSubmitted(false);
            setCheckInDate('');
            setCheckOutDate('');
            setGuestCount(1);
            setFormData({ name: '', email: '', phone: '', notes: '' });
          }}
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-10 text-center">
        <p className="mb-2 font-mono text-sm uppercase tracking-[0.15em] text-primary">
          Plan Your Stay
        </p>
        <h1 className="mb-3 font-display text-3xl font-bold sm:text-4xl">
          Book <span className="text-gold-gradient">Villa Amore</span>
        </h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Choose your dates and submit a request. We&apos;ll contact you to
          confirm availability.
        </p>
      </div>

      <div className="space-y-6 rounded-lg border border-border/30 bg-card p-5 sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="villa-check-in" className="mb-2 block">
              Check-in Date *
            </Label>
            <Input
              id="villa-check-in"
              type="date"
              min={today}
              value={checkInDate}
              onChange={(event) => {
                setCheckInDate(event.target.value);
                if (checkOutDate && checkOutDate <= event.target.value) {
                  setCheckOutDate('');
                }
              }}
            />
          </div>

          <div>
            <Label htmlFor="villa-check-out" className="mb-2 block">
              Check-out Date *
            </Label>
            <Input
              id="villa-check-out"
              type="date"
              min={checkInDate || today}
              value={checkOutDate}
              onChange={(event) => setCheckOutDate(event.target.value)}
            />
          </div>
        </div>

        <div>
          <Label className="mb-3 block">Number of Guests</Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-mono text-xl">
              {guestCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setGuestCount(guestCount + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="mb-3 block">Contact Information</Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="villa-name" className="mb-1 block text-xs text-muted-foreground">
                Full Name *
              </Label>
              <Input
                id="villa-name"
                value={formData.name}
                onChange={(event) =>
                  setFormData({ ...formData, name: event.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="villa-email" className="mb-1 block text-xs text-muted-foreground">
                Email *
              </Label>
              <Input
                id="villa-email"
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData({ ...formData, email: event.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="villa-phone" className="mb-1 block text-xs text-muted-foreground">
                Phone *
              </Label>
              <Input
                id="villa-phone"
                type="tel"
                value={formData.phone}
                onChange={(event) =>
                  setFormData({ ...formData, phone: event.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="villa-notes" className="mb-1 block text-xs text-muted-foreground">
            Special Requests
          </Label>
          <Textarea
            id="villa-notes"
            rows={4}
            value={formData.notes}
            onChange={(event) =>
              setFormData({ ...formData, notes: event.target.value })
            }
          />
        </div>

        <Button
          className="w-full"
          size="lg"
          disabled={submitting}
          onClick={handleSubmit}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CalendarDays className="mr-2 h-4 w-4" />
              Submit Villa Request
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          This is a booking request and does not confirm availability.
        </p>
      </div>
    </div>
  );
}
