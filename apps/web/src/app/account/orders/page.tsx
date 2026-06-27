import { redirect } from 'next/navigation';

export default function LegacyAccountOrdersPage() {
  redirect('/orders');
}
