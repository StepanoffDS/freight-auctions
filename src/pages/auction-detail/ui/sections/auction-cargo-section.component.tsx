import { formatNumber } from '@/entities/auction/lib/format';
import type { AuctionDetailDto } from '@/shared/api/auctions';

import { Field, Section } from '../ui-kit.component';

const BODY_TYPE_LABEL: Record<AuctionDetailDto['cargo']['body_type'], string> =
  {
    Any: 'Любой',
    Container: 'Контейнер',
    Flatbed: 'Борт',
    Isothermal: 'Изотерм',
    Refrigerator: 'Рефрижератор',
    Tent: 'Тент',
  };

function formatTemperature(from: number | null, to: number | null) {
  if (from == null && to == null) {
    return '-';
  }

  return `${from ?? '-'}...${to ?? '-'} C`;
}

export function AuctionCargoSection({
  auction,
}: {
  auction: AuctionDetailDto;
}) {
  return (
    <Section title='Груз и ТС'>
      <div className='grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4'>
        <Field label='Груз' value={auction.cargo.name} />
        <Field
          label='Вес'
          value={formatNumber(auction.cargo.weight_tons, 'т')}
        />
        <Field
          label='Объем'
          value={formatNumber(auction.cargo.volume_m3, 'м3')}
        />
        <Field
          label='Тип кузова'
          value={BODY_TYPE_LABEL[auction.cargo.body_type]}
        />
        <Field label='Упаковка' value={auction.cargo.packaging ?? '-'} />
        <Field
          label='Мест'
          value={auction.cargo.places_count?.toLocaleString('ru-RU') ?? '-'}
        />
        <Field
          label='Температура'
          value={formatTemperature(
            auction.cargo.temperature_from,
            auction.cargo.temperature_to,
          )}
        />
        <Field
          label='Опасный груз'
          value={auction.cargo.is_hazardous ? 'да' : 'нет'}
        />
        <Field
          label='Кузов ТС'
          value={BODY_TYPE_LABEL[auction.vehicle_requirements.body_type]}
        />
        <Field
          label='Тип загрузки'
          value={auction.vehicle_requirements.loading_type ?? '-'}
        />
        <Field
          label='Количество ТС'
          value={auction.vehicle_requirements.vehicle_count.toLocaleString(
            'ru-RU',
          )}
        />
        <Field
          label='Доп. требования'
          value={
            auction.vehicle_requirements.extra_requirements.length > 0
              ? auction.vehicle_requirements.extra_requirements.join(', ')
              : '-'
          }
        />
      </div>
    </Section>
  );
}
