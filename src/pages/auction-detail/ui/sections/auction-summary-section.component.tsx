import { AUCTION_STATUS_LABEL, AUCTION_TYPE_LABEL } from '@/entities/auction';
import {
  formatAuctionDate,
  formatMoney,
  formatNumber,
} from '@/entities/auction/lib/format';
import { USER_TRADING_STATUS_LABEL } from '@/entities/auction/model/status';
import type { AuctionDetailDto } from '@/shared/api/auctions';
import { Badge } from '@/shared/ui/kit/badge';

import { Field, PrimaryAction, Section } from '../ui-kit.component';

const BET_STATUS_LABEL: Record<
  NonNullable<AuctionDetailDto['my_bet']>['status'],
  string
> = {
  Active: 'активна',
  Canceled: 'отменена',
  Outbid: 'перебита',
  Rejected: 'отклонена',
  Winner: 'победила',
};

export function AuctionSummarySection({
  auction,
  auctionUuid,
}: {
  auction: AuctionDetailDto;
  auctionUuid: string;
}) {
  const userStatus = auction.user_trading_status
    ? USER_TRADING_STATUS_LABEL[auction.user_trading_status]
    : 'Нет статуса';

  return (
    <Section>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <div className='flex flex-wrap gap-2 text-xs text-muted-foreground'>
            <Badge variant='secondary'>
              {AUCTION_TYPE_LABEL[auction.auc_type]}
            </Badge>
            <Badge variant='secondary'>
              {AUCTION_STATUS_LABEL[auction.status]}
            </Badge>
            <Badge variant='secondary'>{userStatus}</Badge>
          </div>
          <p className='mt-3 text-sm text-muted-foreground'>
            Создан: {formatAuctionDate(auction.created_at)}. Обновлен:{' '}
            {formatAuctionDate(auction.updated_at)}
          </p>
        </div>

        <PrimaryAction auction={auction} auctionUuid={auctionUuid} />
      </div>

      <div className='grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4'>
        <Field label='Организатор' value={auction.organizer.name} />
        <Field label='ИНН' value={auction.organizer.inn ?? '-'} />
        <Field
          label='Дистанция'
          value={formatNumber(auction.route.distance_km, 'км')}
        />
        <Field
          label='Моя ставка'
          value={
            auction.my_bet
              ? `${formatMoney(
                  auction.my_bet.price,
                  auction.price.currency,
                )} / ${BET_STATUS_LABEL[auction.my_bet.status]} / ${
                  auction.my_bet.ranking_place ?? '-'
                } место`
              : 'нет'
          }
        />
      </div>
    </Section>
  );
}
