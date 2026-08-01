import type { AuctionListItemDto } from '@/shared/api';
import { Card } from '@/shared/ui/kit/card';

import { USER_TRADING_STATUS_LABEL } from '../model/status';
import { AuctionCardBody } from './auction-card-body.component';
import { AuctionCardHeader } from './auction-card-header.component';

type AuctionCardProps = {
  auction: AuctionListItemDto;
  onPrefetch?: (auctionUuid: string) => void;
};

export function AuctionCard({ auction, onPrefetch }: AuctionCardProps) {
  const userStatus = auction.user_trading_status
    ? USER_TRADING_STATUS_LABEL[auction.user_trading_status]
    : 'Нет статуса';

  return (
    <Card
      className='gap-4 p-4 shadow-xs transition-colors hover:ring-primary/40 sm:p-5'
      onFocus={() => onPrefetch?.(auction.auction_uuid)}
      onMouseEnter={() => onPrefetch?.(auction.auction_uuid)}
    >
      <AuctionCardHeader auction={auction} userStatus={userStatus} />

      <AuctionCardBody auction={auction} />
    </Card>
  );
}
