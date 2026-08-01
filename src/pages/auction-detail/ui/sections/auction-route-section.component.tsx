import { formatAuctionDate } from '@/entities/auction';
import type { AuctionDetailDto } from '@/shared/api/auctions';

import type { Contact } from '../../types';
import { Field, Section } from '../ui-kit.component';

export function AuctionRouteSection({
  auction,
}: {
  auction: AuctionDetailDto;
}) {
  return (
    <Section title='Маршрут'>
      <div className='grid gap-3'>
        {auction.route.points
          .slice()
          .sort((a, b) => a.sequence - b.sequence)
          .map((point) => (
            <RoutePointRow
              contactsHidden={auction.trading.hide_points_address_and_contacts}
              key={point.point_uuid}
              point={point}
            />
          ))}
      </div>
    </Section>
  );
}

type RoutePoint = AuctionDetailDto['route']['points'][number];

const POINT_TYPE_LABEL: Record<RoutePoint['type'], string> = {
  Load: 'Погрузка',
  Unload: 'Выгрузка',
};

function formatContact(contact: Contact) {
  return [contact.name, contact.phone, contact.email]
    .filter(Boolean)
    .join(', ');
}

export function RoutePointRow({
  contactsHidden,
  point,
}: {
  contactsHidden: boolean;
  point: RoutePoint;
}) {
  return (
    <div className='grid gap-2 border-t pt-3 text-sm first:border-t-0 first:pt-0 sm:grid-cols-4'>
      <Field
        label={`${point.sequence}. ${POINT_TYPE_LABEL[point.type]}`}
        value={`${point.city.name}${point.city.region ? `, ${point.city.region}` : ''}`}
      />
      <Field
        label='Адрес'
        value={point.address ?? (contactsHidden ? 'скрыт' : '-')}
      />
      <Field
        label='Дата'
        value={`${formatAuctionDate(point.date_from)} - ${formatAuctionDate(point.date_to)}`}
      />
      <Field
        label='Контакты точки'
        value={
          contactsHidden
            ? 'скрыты'
            : point.contacts.length > 0
              ? point.contacts.map(formatContact).join('; ')
              : '-'
        }
      />
    </div>
  );
}
