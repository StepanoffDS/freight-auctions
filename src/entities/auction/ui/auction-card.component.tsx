import { Link } from '@tanstack/react-router';
import { CheckIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import type { AuctionListItemDto } from '@/shared/api';
import { cn } from '@/shared/lib/css';
import { ROUTES } from '@/shared/model/routes';
import { Badge } from '@/shared/ui/kit/badge';
import { Button } from '@/shared/ui/kit/button';

import { formatAuctionDate, formatMoney, formatNumber } from '../lib/format';
import {
  AUCTION_STATUS_LABEL,
  AUCTION_TYPE_LABEL,
  USER_TRADING_STATUS_LABEL,
} from '../model/status';

type AuctionCardProps = {
  auction: AuctionListItemDto;
  onPrefetch?: (auctionUuid: string) => void;
};

export function AuctionCard({ auction, onPrefetch }: AuctionCardProps) {
  const action = getPrimaryAction(auction);
  const userStatus = auction.user_trading_status
    ? USER_TRADING_STATUS_LABEL[auction.user_trading_status]
    : 'Нет статуса';

  return (
    <article
      className='grid gap-4 rounded-md border bg-card p-4 shadow-xs transition-colors hover:border-primary/40 sm:p-5'
      onFocus={() => onPrefetch?.(auction.auction_uuid)}
      onMouseEnter={() => onPrefetch?.(auction.auction_uuid)}
    >
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

        {action.to ? (
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
        )}
      </div>

      <div className='grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4'>
        <Field
          label='Маршрут'
          value={`${auction.route.load_city.name} -> ${auction.route.unload_city.name}`}
        />
        <Field
          label='Даты'
          value={`${formatAuctionDate(auction.loading_date)} - ${formatAuctionDate(
            auction.unloading_date,
          )}`}
        />
        <Field
          label='Груз'
          value={`${auction.cargo.name}, ${formatNumber(
            auction.cargo.weight_tons,
            'т',
          )}, ${formatNumber(auction.cargo.volume_m3, 'м3')}, ${
            auction.cargo.body_type
          }`}
        />
        <Field
          label='Ставка'
          value={
            auction.has_my_bet ? (
              <span className='inline-flex items-center gap-1.5 text-green-600'>
                <CheckIcon className='size-4' />
                моя ставка есть
              </span>
            ) : (
              'моей ставки нет'
            )
          }
        />
      </div>

      <div className='grid gap-3 border-t pt-4 text-sm sm:grid-cols-3'>
        <Field
          label='Текущая цена'
          value={formatMoney(
            auction.price.current_price,
            auction.price.currency,
          )}
        />
        <Field
          label='Цена за км'
          value={formatMoney(
            auction.price.price_per_km,
            auction.price.currency,
          )}
        />
        <Field
          label='Шаг ставки'
          value={formatMoney(auction.price.bet_step, auction.price.currency)}
        />
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className='min-w-0'>
      <div className='text-xs font-medium uppercase text-muted-foreground'>
        {label}
      </div>
      <div className='mt-1 break-words'>{value}</div>
    </div>
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
