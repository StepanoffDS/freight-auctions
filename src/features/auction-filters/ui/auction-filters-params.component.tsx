import {
  AUCTION_STATUS_LABEL,
  AUCTION_STATUSES,
  AUCTION_TYPE_LABEL,
} from '@/entities/auction';

import type { AuctionsSearchParams } from '../model/search-params';
import { AUCTION_TYPES } from '../model/search-params';
import { BooleanSelect } from './params/boolean-select.component';
import { CitySelect } from './params/city-select.component';
import { DateInput } from './params/date-input.component';
import { NumberInput } from './params/number-input.component';
import { SelectField } from './params/select-field.component';
import { TextInput } from './params/text-input.component';

const FILTER_INPUT_DEBOUNCE_MS = 500;

type AuctionFiltersParamsProps = {
  value: AuctionsSearchParams;
  onChange: (patch: Partial<AuctionsSearchParams>) => void;
  resetKey: number;
};

export function AuctionFiltersParams({
  onChange,
  resetKey,
  value,
}: AuctionFiltersParamsProps) {
  return (
    <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
      <TextInput
        debounceMs={FILTER_INPUT_DEBOUNCE_MS}
        key={`cargo-${resetKey}-${value.cargo_num ?? ''}`}
        label='Номер заявки'
        onChange={(cargo_num) => onChange({ cargo_num })}
        value={value.cargo_num}
      />
      <SelectField
        label='Статус'
        onChange={(status) =>
          onChange({
            status: status as AuctionsSearchParams['status'],
            statuses: [],
          })
        }
        options={AUCTION_STATUSES.map((status) => ({
          label: AUCTION_STATUS_LABEL[status],
          value: status,
        }))}
        value={value.status}
      />
      <SelectField
        label='Тип'
        onChange={(auc_type) =>
          onChange({ auc_type: auc_type as AuctionsSearchParams['auc_type'] })
        }
        options={AUCTION_TYPES.map((type) => ({
          label: AUCTION_TYPE_LABEL[type],
          value: type,
        }))}
        value={value.auc_type}
      />
      <CitySelect
        label='Погрузка'
        onChange={(load_city_uuid) => onChange({ load_city_uuid })}
        value={value.load_city_uuid}
      />
      <CitySelect
        label='Выгрузка'
        onChange={(unload_city_uuid) => onChange({ unload_city_uuid })}
        value={value.unload_city_uuid}
      />
      <DateInput
        label='Погрузка от'
        onChange={(loading_date_from) => onChange({ loading_date_from })}
        value={value.loading_date_from}
      />
      <DateInput
        label='Погрузка до'
        onChange={(loading_date_to) => onChange({ loading_date_to })}
        value={value.loading_date_to}
      />
      <BooleanSelect
        label='Доступность'
        onChange={(is_available) => onChange({ is_available })}
        value={value.is_available}
      />
      <BooleanSelect
        label='Моя ставка'
        onChange={(is_bidder) => onChange({ is_bidder })}
        value={value.is_bidder}
      />
      <NumberInput
        debounceMs={FILTER_INPUT_DEBOUNCE_MS}
        key={`price-from-${resetKey}-${value.price_from ?? ''}`}
        label='Цена от'
        onChange={(price_from) => onChange({ price_from })}
        value={value.price_from}
      />
      <NumberInput
        debounceMs={FILTER_INPUT_DEBOUNCE_MS}
        key={`price-to-${resetKey}-${value.price_to ?? ''}`}
        label='Цена до'
        onChange={(price_to) => onChange({ price_to })}
        value={value.price_to}
      />
    </div>
  );
}
