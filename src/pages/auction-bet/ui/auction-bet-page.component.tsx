import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

import { AuctionBetForm } from '@/features/set-auction-bet';
import { auctionQueries } from '@/shared/api';

export function AuctionBetPage() {
  const { auctionUuid } = useParams({ strict: false }) as {
    auctionUuid: string;
  };
  const { data, error, isError, isPending } = useQuery(
    auctionQueries.detail(auctionUuid),
  );

  if (isPending) {
    return (
      <AuctionBetLayout title='Ставка'>Загрузка формы...</AuctionBetLayout>
    );
  }

  if (isError) {
    return (
      <AuctionBetLayout title='Ставка'>
        Не удалось загрузить: {error.message}
      </AuctionBetLayout>
    );
  }

  if (!data) {
    return <AuctionBetLayout title='Ставка'>Нет данных.</AuctionBetLayout>;
  }

  return (
    <AuctionBetLayout title={`Ставка по ${data.cargo_num}`}>
      <AuctionBetForm auction={data} />
    </AuctionBetLayout>
  );
}

function AuctionBetLayout({
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
