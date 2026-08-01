import { Link } from '@tanstack/react-router';

import type { AuctionListItemDto } from '@/shared/api/auctions';
import { cn } from '@/shared/lib/css';
import { ROUTES } from '@/shared/model/routes';
import { Button } from '@/shared/ui/kit/button';

export function ActionButton({ auction }: { auction: AuctionListItemDto }) {
  const action = getPrimaryAction(auction);

  return action.to ? (
    <Link
      to={action.to}
      params={{ auctionUuid: auction.auction_uuid }}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium',
        action.primary
          ? 'bg-primary text-primary-foreground'
          : 'border bg-background',
      )}
    >
      {action.label}
    </Link>
  ) : (
    <Button
      className='h-10 rounded-md px-4 text-sm text-muted-foreground'
      disabled
      type='button'
      variant='outline'
    >
      {action.label}
    </Button>
  );
}

function getPrimaryAction(auction: AuctionListItemDto) {
  if (auction.trading.can_set_bet) {
    return {
      label: auction.has_my_bet ? 'Изменить ставку' : 'Сделать ставку',
      primary: true,
      to: ROUTES.AUCTION_BET,
    };
  }

  if (!auction.trading.hide_bets_history) {
    return {
      label: 'Смотреть ставки',
      primary: false,
      to: ROUTES.AUCTION,
    };
  }

  return {
    label: 'Недоступно',
    primary: false,
    to: null,
  };
}
