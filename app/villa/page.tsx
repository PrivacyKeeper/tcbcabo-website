import { redirect } from 'next/navigation';

// Villa Amore currently books through the main booking page with the villa
// pre-selected. This route exists so the "Villa Amore" nav links resolve
// instead of 404ing. When a dedicated Villa Amore landing page / mini-site is
// built later, replace this redirect with that page.
export default function VillaPage() {
  redirect('/book?type=villa');
}
