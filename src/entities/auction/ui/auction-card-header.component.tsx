import { Link } from '@tanstack/react-router';

import type { AuctionListItemDto } from '@/shared/api/auctions';
import { ROUTES } from '@/shared/model/routes';
import { Badge } from '@/shared/ui/kit/badge';

import { AUCTION_STATUS_LABEL, AUCTION_TYPE_LABEL } from '../model/status';
import { ActionButton } from './action-button.components';

export function AuctionCardHeader({
  auction,
  userStatus,
}: {
  auction: AuctionListItemDto;
  userStatus: string;
}) {
  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
      <div className='min-w-0'>
        <Link
          to={ROUTES.AUCTION}
          params={{ auctionUuid: auction.auction_uuid }}
          className='text-lg font-semibold hover:text-primary'
        >
          {auction.cargo_num}
        </Link>
        <div className='mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground'>
          <Badge variant='secondary'>
            {AUCTION_TYPE_LABEL[auction.auc_type]}
          </Badge>
          <Badge variant='secondary'>
            {AUCTION_STATUS_LABEL[auction.status]}
          </Badge>
          <Badge variant='secondary'>{userStatus}</Badge>
        </div>
      </div>

      <ActionButton auction={auction} />
    </div>
  );
}
