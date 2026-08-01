import { formatNumber } from '@/entities/auction/lib/format';
import type { AuctionDetailDto } from '@/shared/api/auctions';
import { ParamField } from '@/shared/ui/ParamField.component';

import { Section } from '../ui-kit.component';

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
        <ParamField label='Груз' value={auction.cargo.name} />
        <ParamField
          label='Вес'
          value={formatNumber(auction.cargo.weight_tons, 'т')}
        />
        <ParamField
          label='Объем'
          value={formatNumber(auction.cargo.volume_m3, 'м3')}
        />
        <ParamField
          label='Тип кузова'
          value={BODY_TYPE_LABEL[auction.cargo.body_type]}
        />
        <ParamField label='Упаковка' value={auction.cargo.packaging ?? '-'} />
        <ParamField
          label='Мест'
          value={auction.cargo.places_count?.toLocaleString('ru-RU') ?? '-'}
        />
        <ParamField
          label='Температура'
          value={formatTemperature(
            auction.cargo.temperature_from,
            auction.cargo.temperature_to,
          )}
        />
        <ParamField
          label='Опасный груз'
          value={auction.cargo.is_hazardous ? 'да' : 'нет'}
        />
        <ParamField
          label='Кузов ТС'
          value={BODY_TYPE_LABEL[auction.vehicle_requirements.body_type]}
        />
        <ParamField
          label='Тип загрузки'
          value={auction.vehicle_requirements.loading_type ?? '-'}
        />
        <ParamField
          label='Количество ТС'
          value={auction.vehicle_requirements.vehicle_count.toLocaleString(
            'ru-RU',
          )}
        />
        <ParamField
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
