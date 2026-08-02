'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Building2, Ship } from 'lucide-react';
import { BookingForm } from './booking-form';
import { VillaBookingForm } from './villa-booking-form';

export function BookingExperience() {
  const searchParams = useSearchParams();
  // Preselect the villa when arriving via /book?type=villa (the /villa route
  // redirects here). Everything else defaults to the boat charter flow.
  const initialType =
    searchParams.get('type') === 'villa' ? 'villa' : 'charter';
  const [bookingType, setBookingType] = useState<'charter' | 'villa'>(initialType);

  return (
    <>
      <div className="mx-auto max-w-[700px] px-4 pt-8 sm:px-6">
        <p className="mb-3 text-center text-sm font-semibold uppercase tracking-wider text-primary">
          What would you like to book?
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setBookingType('charter')}
            className={`rounded-lg border p-4 transition-all ${
              bookingType === 'charter'
                ? 'border-primary/50 bg-primary/15 text-primary'
                : 'border-border/30 bg-card text-muted-foreground'
            }`}
          >
            <Ship className="mx-auto mb-2 h-5 w-5" />
            <span className="font-semibold">Boat Charter</span>
          </button>

          <button
            type="button"
            onClick={() => setBookingType('villa')}
            className={`rounded-lg border p-4 transition-all ${
              bookingType === 'villa'
                ? 'border-primary/50 bg-primary/15 text-primary'
                : 'border-border/30 bg-card text-muted-foreground'
            }`}
          >
            <Building2 className="mx-auto mb-2 h-5 w-5" />
            <span className="font-semibold">Villa Amore</span>
          </button>
        </div>
      </div>

      {bookingType === 'charter' ? <BookingForm /> : <VillaBookingForm />}
    </>
  );
}
