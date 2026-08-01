import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';

import { auctionQueries } from '@/shared/api';
import { DEFAULT_AUCTIONS_SEARCH } from '@/shared/model/auctions';
import { ROUTES } from '@/shared/model/routes';

export function AuctionDetailPage() {
  const { auctionUuid } = useParams({ strict: false }) as {
    auctionUuid: string;
  };
  const { data, error, isError, isPending } = useQuery(
    auctionQueries.detail(auctionUuid),
  );

  if (isPending) {
    return <PageShell title='Аукцион'>Загрузка карточки...</PageShell>;
  }

  if (isError) {
    return (
      <PageShell title='Аукцион'>
        Не удалось загрузить: {error.message}
      </PageShell>
    );
  }

  if (!data) {
    return <PageShell title='Аукцион'>Нет данных.</PageShell>;
  }

  return (
    <PageShell title={data.cargo_num}>
      <div className='grid gap-4 rounded-md border bg-card p-4'>
        <p className='text-sm text-muted-foreground'>
          {data.auc_type} / {data.status}
        </p>
        <p>
          {data.route.points[0]?.city.name} {'->'}{' '}
          {data.route.points[data.route.points.length - 1]?.city.name}
        </p>
        <p>
          {data.cargo.name}, {data.cargo.weight_tons ?? '-'} т,{' '}
          {data.cargo.volume_m3 ?? '-'} м3
        </p>
        <p>
          Текущая цена:{' '}
          {data.price.current_price == null
            ? 'скрыта'
            : `${data.price.current_price} ${data.price.currency}`}
        </p>
        <div className='flex flex-wrap gap-3'>
          <Link
            to={ROUTES.AUCTIONS}
            search={DEFAULT_AUCTIONS_SEARCH}
            className='rounded-md border px-3 py-2 text-sm'
          >
            К списку
          </Link>
          <Link
            to={ROUTES.AUCTION_BET}
            params={{ auctionUuid }}
            className='rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground'
          >
            {data.my_bet ? 'Изменить ставку' : 'Сделать ставку'}
          </Link>
        </div>
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
