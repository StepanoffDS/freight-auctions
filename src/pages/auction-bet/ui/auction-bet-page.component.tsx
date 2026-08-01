import { Link, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

import { auctionQueries } from '@/shared/api';
import { ROUTES } from '@/shared/model/routes';

export function AuctionBetPage() {
  const { auctionUuid } = useParams({ strict: false }) as {
    auctionUuid: string;
  };
  const { data, error, isError, isPending } = useQuery(
    auctionQueries.detail(auctionUuid),
  );

  if (isPending) {
    return <PageShell title='Ставка'>Загрузка формы...</PageShell>;
  }

  if (isError) {
    return (
      <PageShell title='Ставка'>
        Не удалось загрузить: {error.message}
      </PageShell>
    );
  }

  if (!data) {
    return <PageShell title='Ставка'>Нет данных.</PageShell>;
  }

  return (
    <PageShell title={`Ставка по ${data.cargo_num}`}>
      <div className='rounded-md border bg-card p-4'>
        <p className='text-sm text-muted-foreground'>
          Доступность:{' '}
          {data.trading.can_set_bet ? 'можно поставить' : 'недоступно'}
        </p>
        <p className='mt-3'>
          Рекомендуемая цена:{' '}
          {data.price.available_price == null
            ? 'нет'
            : `${data.price.available_price} ${data.price.currency}`}
        </p>
        <Link
          to={ROUTES.AUCTION}
          params={{ auctionUuid }}
          className='mt-4 inline-block rounded-md border px-3 py-2 text-sm'
        >
          К карточке
        </Link>
      </div>
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
