import { redirect } from 'next/navigation';

interface PageProps {
  params: { id: string };
}

export default function LegacyAccountOrderDetailPage({ params }: PageProps) {
  redirect(`/orders/${params.id}`);
}
