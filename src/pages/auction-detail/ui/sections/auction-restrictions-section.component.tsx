import type { AuctionDetailDto } from '@/shared/api/auctions';

import { Field, Section } from '../ui-kit.component';

export function AuctionRestrictionsSection({
  auction,
}: {
  auction: AuctionDetailDto;
}) {
  return (
    <Section title='Ограничения'>
      <div className='grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4'>
        <Field
          label='Ставка'
          value={auction.trading.can_set_bet ? 'доступна' : 'недоступна'}
        />
        <Field
          label='История ставок'
          value={auction.trading.hide_bets_history ? 'скрыта' : 'доступна'}
        />
        <Field
          label='Адреса и контакты'
          value={
            auction.trading.hide_points_address_and_contacts
              ? 'скрыты'
              : 'доступны'
          }
        />
        <Field
          label='Цена груза'
          value={auction.trading.no_view_cargo_price ? 'скрыта' : 'доступна'}
        />
      </div>
    </Section>
  );
}
