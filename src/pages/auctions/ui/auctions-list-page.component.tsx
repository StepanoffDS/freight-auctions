import { Link, useSearch } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

import { auctionQueries } from '@/shared/api';
import { ROUTES } from '@/shared/model/routes';
import {
  DEFAULT_AUCTIONS_SEARCH,
  auctionsSearchSchema,
  buildAuctionsListRequest,
} from '../model/search-params';

export function AuctionsListPage() {
  const search = auctionsSearchSchema.parse(useSearch({ strict: false }));
  const request = buildAuctionsListRequest(search);
  const { data, error, isError, isPending } = useQuery(
    auctionQueries.list(request),
  );

  if (isPending) {
    return <PageShell title='Аукционы'>Загрузка списка...</PageShell>;
  }

  if (isError) {
    return (
      <PageShell title='Аукционы'>
        Не удалось загрузить: {error.message}
      </PageShell>
    );
  }

  if (!data) {
    return <PageShell title='Аукционы'>Нет данных.</PageShell>;
  }

  return (
    <PageShell title='Аукционы'>
      {data.items.length === 0 ? (
        <p className='text-sm text-muted-foreground'>
          По этим фильтрам ничего нет.
        </p>
      ) : (
        <div className='grid gap-3'>
          {data.items.map((auction) => (
            <Link
              key={auction.auction_uuid}
              to={ROUTES.AUCTION}
              params={{ auctionUuid: auction.auction_uuid }}
              className='rounded-md border bg-card p-4 transition-colors hover:bg-accent'
            >
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <h2 className='font-semibold'>{auction.cargo_num}</h2>
                <span className='text-sm text-muted-foreground'>
                  {auction.auc_type} / {auction.status}
                </span>
              </div>
              <p className='mt-2 text-sm'>
                {auction.route.load_city.name} {'->'}{' '}
                {auction.route.unload_city.name}
              </p>
              <p className='mt-1 text-sm text-muted-foreground'>
                {auction.cargo.name}, {auction.loading_date}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className='mt-6 flex items-center gap-3 text-sm'>
        <Link
          to={ROUTES.AUCTIONS}
          search={{
            ...DEFAULT_AUCTIONS_SEARCH,
            ...search,
            page: Math.max(1, search.page - 1),
          }}
          className='rounded-md border px-3 py-2'
        >
          Назад
        </Link>
        <span className='text-muted-foreground'>
          {data.pagination.page} / {Math.max(1, data.pagination.pages)}
        </span>
        <Link
          to={ROUTES.AUCTIONS}
          search={{
            ...DEFAULT_AUCTIONS_SEARCH,
            ...search,
            page: Math.min(data.pagination.pages || 1, search.page + 1),
          }}
          className='rounded-md border px-3 py-2'
        >
          Вперед
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
