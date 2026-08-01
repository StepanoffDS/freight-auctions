import { Controller, useFormContext } from 'react-hook-form';

import { AUCTION_TYPE_LABEL } from '@/entities/auction';

import { useAuctionFiltersContext } from '../model/auction-filters-context';
import type { AuctionsSearchParams } from '../model/search-params';
import { AUCTION_TYPES } from '../model/search-params';
import { BooleanSelect } from './params/boolean-select.component';
import { CitySelect } from './params/city-select.component';
import { DateInput } from './params/date-input.component';
import { NumberInput } from './params/number-input.component';
import { SelectField } from './params/select-field.component';
import { TextInput } from './params/text-input.component';

export function AuctionFiltersParams() {
  const { control } = useFormContext<AuctionsSearchParams>();
  const { debouncedChange, onChange } = useAuctionFiltersContext();

  return (
    <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
      <Controller
        control={control}
        name='cargo_num'
        render={({ field }) => (
          <TextInput
            label='Номер заявки'
            onChange={(cargo_num) => {
              field.onChange(cargo_num);
              debouncedChange.changeCargoNum(cargo_num);
            }}
            value={field.value}
          />
        )}
      />
      <Controller
        control={control}
        name='auc_type'
        render={({ field }) => (
          <SelectField
            label='Тип'
            onChange={(auc_type) => {
              const nextType = auc_type as AuctionsSearchParams['auc_type'];

              field.onChange(nextType);
              onChange({ auc_type: nextType });
            }}
            options={AUCTION_TYPES.map((type) => ({
              label: AUCTION_TYPE_LABEL[type],
              value: type,
            }))}
            value={field.value}
          />
        )}
      />
      <Controller
        control={control}
        name='load_city_uuid'
        render={({ field }) => (
          <CitySelect
            label='Погрузка'
            onChange={(load_city_uuid) => {
              field.onChange(load_city_uuid);
              onChange({ load_city_uuid });
            }}
            value={field.value}
          />
        )}
      />
      <Controller
        control={control}
        name='unload_city_uuid'
        render={({ field }) => (
          <CitySelect
            label='Выгрузка'
            onChange={(unload_city_uuid) => {
              field.onChange(unload_city_uuid);
              onChange({ unload_city_uuid });
            }}
            value={field.value}
          />
        )}
      />
      <Controller
        control={control}
        name='loading_date_from'
        render={({ field }) => (
          <DateInput
            label='Погрузка от'
            onChange={(loading_date_from) => {
              field.onChange(loading_date_from);
              onChange({ loading_date_from });
            }}
            value={field.value}
          />
        )}
      />
      <Controller
        control={control}
        name='loading_date_to'
        render={({ field }) => (
          <DateInput
            label='Погрузка до'
            onChange={(loading_date_to) => {
              field.onChange(loading_date_to);
              onChange({ loading_date_to });
            }}
            value={field.value}
          />
        )}
      />
      <Controller
        control={control}
        name='is_available'
        render={({ field }) => (
          <BooleanSelect
            label='Доступность'
            onChange={(is_available) => {
              field.onChange(is_available);
              onChange({ is_available });
            }}
            value={field.value}
          />
        )}
      />
      <Controller
        control={control}
        name='is_bidder'
        render={({ field }) => (
          <BooleanSelect
            label='Моя ставка'
            onChange={(is_bidder) => {
              field.onChange(is_bidder);
              onChange({ is_bidder });
            }}
            value={field.value}
          />
        )}
      />
      <Controller
        control={control}
        name='price_from'
        render={({ field }) => (
          <NumberInput
            label='Цена от'
            onChange={(price_from) => {
              field.onChange(price_from);
              debouncedChange.changePriceFrom(price_from);
            }}
            value={field.value}
          />
        )}
      />
      <Controller
        control={control}
        name='price_to'
        render={({ field }) => (
          <NumberInput
            label='Цена до'
            onChange={(price_to) => {
              field.onChange(price_to);
              debouncedChange.changePriceTo(price_to);
            }}
            value={field.value}
          />
        )}
      />
    </div>
  );
}
