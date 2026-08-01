import { formatMoney } from '@/entities/auction';
import type { AuctionDetailDto } from '@/shared/api/auctions';
import { ParamField } from '@/shared/ui/ParamField.component';

export function AuctionBetInfo({ auction }: { auction: AuctionDetailDto }) {
  return (
    <div className='grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4'>
      <ParamField
        label='Доступная цена'
        value={formatMoney(
          auction.price.available_price,
          auction.price.currency,
        )}
      />

      <ParamField
        label='Шаг ставки'
        value={formatMoney(auction.price.bet_step, auction.price.currency)}
      />
      <ParamField
        label='Минимум'
        value={formatMoney(auction.price.min_bet_price, auction.price.currency)}
      />
      <ParamField
        label='Максимум'
        value={formatMoney(auction.price.max_bet_price, auction.price.currency)}
      />
    </div>
  );
}
