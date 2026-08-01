import type { AuctionDetailDto } from '@/shared/api/auctions';

import type { Contact } from '../../types';
import { Section } from '../ui-kit.component';

export function AuctionContactsSection({
  auction,
}: {
  auction: AuctionDetailDto;
}) {
  return (
    <Section title='Контакты'>
      {auction.contacts.is_hidden ? (
        <p className='text-sm text-muted-foreground'>
          Контакты скрыты организатором.
        </p>
      ) : auction.contacts.items.length === 0 ? (
        <p className='text-sm text-muted-foreground'>Контактов нет.</p>
      ) : (
        <div className='grid gap-3 text-sm sm:grid-cols-2'>
          {auction.contacts.items.map((contact, index) => (
            <ContactRow contact={contact} key={index} />
          ))}
        </div>
      )}
    </Section>
  );
}

export function ContactRow({ contact }: { contact: Contact }) {
  return (
    <div className='grid gap-1 border-t pt-3 first:border-t-0 first:pt-0'>
      <div className='font-medium'>{contact.name ?? 'Без имени'}</div>
      <div className='text-muted-foreground'>
        {contact.phone ?? 'телефон не указан'}
      </div>
      <div className='text-muted-foreground'>
        {contact.email ?? 'email не указан'}
      </div>
    </div>
  );
}
