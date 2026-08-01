import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { AuctionCard } from '@/entities/auction';
import {
  AuctionFilters,
  type AuctionsSearchParams,
  auctionsSearchSchema,
  buildAuctionsListRequest,
  DEFAULT_AUCTIONS_SEARCH,
} from '@/features/auction-filters';
import { AuctionPagination } from '@/features/auction-pagination';
import { auctionQueries } from '@/shared/api';
import { ROUTES } from '@/shared/model/routes';

export function AuctionsList() {
  const navigate = useNavigate({ from: ROUTES.AUCTIONS });
  const queryClient = useQueryClient();
  const search = auctionsSearchSchema.parse(useSearch({ strict: false }));
  const request = buildAuctionsListRequest(search);
  const { data, error, isError, isPending } = useQuery(
    auctionQueries.list(request),
  );

  const updateSearch = (patch: Partial<AuctionsSearchParams>) => {
    void navigate({
      replace: true,
      search: (prev) =>
        auctionsSearchSchema.parse({
          ...prev,
          ...patch,
          page: patch.page ?? 1,
        }),
    });
  };

  const prefetchDetail = (auctionUuid: string) => {
    void queryClient.prefetchQuery(auctionQueries.detail(auctionUuid));
  };

  return (
    <div className='grid gap-5'>
      <AuctionFilters
        onChange={updateSearch}
        onReset={() => {
          void navigate({ replace: true, search: DEFAULT_AUCTIONS_SEARCH });
        }}
        value={search}
      />

      {isPending ? (
        <AuctionsListSkeleton />
      ) : isError ? (
        <AuctionsListError message={error.message} />
      ) : !data ? (
        <AuctionsListEmpty />
      ) : data.items.length === 0 ? (
        <AuctionsListEmpty />
      ) : (
        <>
          <div className='grid gap-4'>
            {data.items.map((auction) => (
              <AuctionCard
                auction={auction}
                key={auction.auction_uuid}
                onPrefetch={prefetchDetail}
              />
            ))}
          </div>
          <AuctionPagination
            onPageChange={(page) => updateSearch({ page })}
            onPerPageChange={(per_page) => updateSearch({ per_page })}
            page={data.pagination.page}
            pages={data.pagination.pages}
            perPage={data.pagination.per_page}
            total={data.pagination.total}
          />
        </>
      )}
    </div>
  );
}

function AuctionsListSkeleton() {
  return (
    <div className='grid gap-4'>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className='grid gap-4 rounded-md border bg-card p-4 sm:p-5'
          key={index}
        >
          <div className='h-6 w-48 animate-pulse rounded-md bg-muted' />
          <div className='grid gap-3 sm:grid-cols-4'>
            <div className='h-12 animate-pulse rounded-md bg-muted' />
            <div className='h-12 animate-pulse rounded-md bg-muted' />
            <div className='h-12 animate-pulse rounded-md bg-muted' />
            <div className='h-12 animate-pulse rounded-md bg-muted' />
          </div>
          <div className='h-10 animate-pulse rounded-md bg-muted' />
        </div>
      ))}
    </div>
  );
}

function AuctionsListError({ message }: { message: string }) {
  return (
    <div className='rounded-md border border-destructive/40 bg-card p-4 text-sm'>
      <div className='font-medium text-destructive'>
        Не удалось загрузить список
      </div>
      <div className='mt-1 text-muted-foreground'>{message}</div>
    </div>
  );
}

function AuctionsListEmpty() {
  return (
    <div className='rounded-md border bg-card p-8 text-center'>
      <h2 className='text-lg font-semibold'>Аукционы не найдены</h2>
      <p className='mt-2 text-sm text-muted-foreground'>
        Измените фильтры или сбросьте параметры поиска.
      </p>
    </div>
  );
}
