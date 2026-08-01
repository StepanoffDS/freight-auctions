import type { AuctionDetailDto } from '@/shared/api/auctions';

import { Field, Section } from '../ui-kit.component';

const PAYMENT_TYPE_LABEL: Record<AuctionDetailDto['payment']['type'], string> =
  {
    Deferred: 'Отсрочка',
    OnUnload: 'При выгрузке',
    Prepayment: 'Предоплата',
  };

export function AuctionPaymentSection({
  auction,
}: {
  auction: AuctionDetailDto;
}) {
  return (
    <Section title='Оплата'>
      <div className='grid gap-3 text-sm sm:grid-cols-3'>
        <Field label='Тип' value={PAYMENT_TYPE_LABEL[auction.payment.type]} />
        <Field
          label='Отсрочка'
          value={
            auction.payment.delay_days == null
              ? '-'
              : `${auction.payment.delay_days} дн.`
          }
        />
        <Field label='Комментарий' value={auction.payment.note ?? '-'} />
      </div>
    </Section>
  );
}
