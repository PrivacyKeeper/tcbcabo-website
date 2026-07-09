import { DashboardContent } from './_components/dashboard-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Captain Dashboard | Striped World Charters',
};

export default function DashboardPage() {
  return <DashboardContent />;
}
