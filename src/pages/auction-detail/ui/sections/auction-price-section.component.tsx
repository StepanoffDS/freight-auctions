import {
  formatAuctionDate,
  formatMoney,
} from '@/entities/auction/lib/format';
import type { AuctionDetailDto } from '@/shared/api/auctions';

import { Field, Section } from '../ui-kit.component';

export function AuctionPriceSection({
  auction,
}: {
  auction: AuctionDetailDto;
}) {
  return (
    <Section title='Цена и торги'>
      <div className='grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4'>
        <Field
          label='Текущая цена'
          value={formatMoney(
            auction.price.current_price,
            auction.price.currency,
          )}
        />
        <Field
          label='Доступная цена'
          value={formatMoney(
            auction.price.available_price,
            auction.price.currency,
          )}
        />
        <Field
          label='Цена за км'
          value={formatMoney(auction.price.price_per_km, auction.price.currency)}
        />
        <Field
          label='Стартовая цена'
          value={formatMoney(auction.price.start_price, auction.price.currency)}
        />
        <Field
          label='Минимум'
          value={formatMoney(
            auction.price.min_bet_price,
            auction.price.currency,
          )}
        />
        <Field
          label='Максимум'
          value={formatMoney(
            auction.price.max_bet_price,
            auction.price.currency,
          )}
        />
        <Field
          label='Шаг'
          value={formatMoney(auction.price.bet_step, auction.price.currency)}
        />
        <Field
          label='НДС'
          value={auction.price.with_vat ? 'с НДС' : 'без НДС'}
        />
        <Field
          label='Начало торгов'
          value={formatAuctionDate(auction.trading.starts_at)}
        />
        <Field
          label='Окончание торгов'
          value={formatAuctionDate(auction.trading.ends_at)}
        />
        <Field
          label='Серверное время'
          value={formatAuctionDate(auction.trading.server_time)}
        />
      </div>
    </Section>
  );
}
