import { CaptainLoginForm } from './_components/login-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Captain Login | Striped World Charters',
};

export default function CaptainLoginPage() {
  return <CaptainLoginForm />;
}
