import { CheckIcon } from 'lucide-react';

import type { AuctionListItemDto } from '@/shared/api/auctions';
import { ParamField } from '@/shared/ui/ParamField.component';

import { formatAuctionDate, formatMoney, formatNumber } from '../lib/format';

export function AuctionCardBody({ auction }: { auction: AuctionListItemDto }) {
  return (
    <>
      <div className='grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4'>
        <ParamField
          label='Маршрут'
          value={`${auction.route.load_city.name} -> ${auction.route.unload_city.name}`}
        />
        <ParamField
          label='Даты'
          value={`${formatAuctionDate(auction.loading_date)} - ${formatAuctionDate(
            auction.unloading_date,
          )}`}
        />
        <ParamField
          label='Груз'
          value={`${auction.cargo.name}, ${formatNumber(
            auction.cargo.weight_tons,
            'т',
          )}, ${formatNumber(auction.cargo.volume_m3, 'м3')}, ${
            auction.cargo.body_type
          }`}
        />
        <ParamField
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
        <ParamField
          label='Текущая цена'
          value={formatMoney(
            auction.price.current_price,
            auction.price.currency,
          )}
        />
        <ParamField
          label='Цена за км'
          value={formatMoney(
            auction.price.price_per_km,
            auction.price.currency,
          )}
        />
        <ParamField
          label='Шаг ставки'
          value={formatMoney(auction.price.bet_step, auction.price.currency)}
        />
      </div>
    </>
  );
}
