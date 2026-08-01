import { Link } from '@tanstack/react-router';

import type { AuctionDetailDto } from '@/shared/api/auctions';
import { ROUTES } from '@/shared/model/routes';
import { Button } from '@/shared/ui/kit/button';

export function PrimaryAction({
  auction,
  auctionUuid,
}: {
  auction: AuctionDetailDto;
  auctionUuid: string;
}) {
  if (auction.trading.can_set_bet) {
    return (
      <Button
        className='h-10 rounded-md px-4 text-sm'
        render={<Link to={ROUTES.AUCTION_BET} params={{ auctionUuid }} />}
      >
        {auction.my_bet ? 'Изменить ставку' : 'Сделать ставку'}
      </Button>
    );
  }

  return (
    <Button
      className='h-10 rounded-md border px-4 text-sm text-muted-foreground'
      disabled
      type='button'
      variant='outline'
    >
      Ставка недоступна
    </Button>
  );
}
