import { AuctionsList } from '@/widgets/auctions-list';

export function AuctionsListPage() {
  return (
    <PageShell title='Аукционы'>
      <AuctionsList />
    </PageShell>
  );
}

function PageShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className='mx-auto max-w-6xl px-4 py-8'>
      <h1 className='mb-6 text-2xl font-semibold'>{title}</h1>
      {children}
    </section>
  );
}
