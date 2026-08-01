import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';

import { auctionQueries } from '@/shared/api';
import { DEFAULT_AUCTIONS_SEARCH } from '@/shared/model/auctions';
import { ROUTES } from '@/shared/model/routes';

import { AuctionCargoSection } from './sections/auction-cargo-section.component';
import { AuctionContactsSection } from './sections/auction-contacts-section.component';
import { AuctionPaymentSection } from './sections/auction-payment-section.component';
import { AuctionPriceSection } from './sections/auction-price-section.component';
import { AuctionRestrictionsSection } from './sections/auction-restrictions-section.component';
import { AuctionRouteSection } from './sections/auction-route-section.component';
import { AuctionSummarySection } from './sections/auction-summary-section.component';
import { AuctionDetailLayout } from './ui-kit.component';

export function AuctionDetailPage() {
  const { auctionUuid } = useParams({ strict: false }) as {
    auctionUuid: string;
  };
  const { data, error, isError, isPending } = useQuery(
    auctionQueries.detail(auctionUuid),
  );

  if (isPending) {
    return (
      <AuctionDetailLayout title='Аукцион'>
        Загрузка карточки...
      </AuctionDetailLayout>
    );
  }

  if (isError) {
    return (
      <AuctionDetailLayout title='Аукцион'>
        Не удалось загрузить: {error.message}
      </AuctionDetailLayout>
    );
  }

  if (!data) {
    return (
      <AuctionDetailLayout title='Аукцион'>Нет данных.</AuctionDetailLayout>
    );
  }

  return (
    <AuctionDetailLayout title={data.cargo_num}>
      <div className='grid gap-5'>
        <AuctionSummarySection auction={data} auctionUuid={auctionUuid} />

        <AuctionPriceSection auction={data} />

        <AuctionRestrictionsSection auction={data} />

        <AuctionRouteSection auction={data} />

        <AuctionCargoSection auction={data} />

        <AuctionPaymentSection auction={data} />

        <AuctionContactsSection auction={data} />

        <Link
          to={ROUTES.AUCTIONS}
          search={DEFAULT_AUCTIONS_SEARCH}
          className='w-fit rounded-md border px-3 py-2 text-sm'
        >
          К списку
        </Link>
      </div>
    </AuctionDetailLayout>
  );
}
