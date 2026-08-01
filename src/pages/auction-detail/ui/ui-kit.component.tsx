import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import type { AuctionDetailDto } from '@/shared/api/auctions';
import { ROUTES } from '@/shared/model/routes';
import { Button } from '@/shared/ui/kit/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/kit/card';

// TODO: refactor
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

export function Section({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className='grid gap-4'>{children}</CardContent>
    </Card>
  );
}

export function AuctionDetailLayout({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className='mx-auto max-w-6xl px-4 py-8'>
      <h1 className='mb-6 text-2xl font-semibold'>{title}</h1>
      {children}
    </section>
  );
}
