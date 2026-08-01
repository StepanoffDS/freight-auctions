import { Controller, useFormContext } from 'react-hook-form';

import { AUCTION_STATUS_LABEL, AUCTION_STATUSES } from '@/entities/auction';
import { Checkbox } from '@/shared/ui/kit/checkbox';
import { Field, FieldLabel } from '@/shared/ui/kit/field';

import { useAuctionFiltersContext } from '../model/auction-filters-context';
import type { AuctionsSearchParams } from '../model/search-params';

export function AuctionFiltersStatuses() {
  const { control } = useFormContext<AuctionsSearchParams>();
  const { onChange } = useAuctionFiltersContext();

  return (
    <Controller
      control={control}
      name='statuses'
      render={({ field }) => (
        <AuctionFiltersStatusesField
          onChange={(nextStatuses) => {
            field.onChange(nextStatuses);
            onChange({ statuses: nextStatuses });
          }}
          statuses={field.value}
        />
      )}
    />
  );
}

function AuctionFiltersStatusesField({
  onChange,
  statuses,
}: {
  statuses: AuctionsSearchParams['statuses'];
  onChange: (statuses: AuctionsSearchParams['statuses']) => void;
}) {
  return (
    <fieldset className='grid gap-2 border-t pt-4'>
      <legend className='text-sm font-medium '>Статус</legend>
      <div className='flex flex-wrap gap-2'>
        {AUCTION_STATUSES.map((status) => {
          const fieldId = `auction-status-${status}`;
          const checked = statuses.includes(status);
          const setChecked = (nextChecked: boolean) => {
            const nextStatuses = nextChecked
              ? [...statuses, status]
              : statuses.filter((item) => item !== status);

            onChange(nextStatuses);
          };

          return (
            <Field
              className='w-auto flex-row items-center gap-2 rounded-md border px-3 py-2 text-sm select-none cursor-pointer'
              key={status}
              onClick={(event) => {
                if (event.currentTarget === event.target) {
                  setChecked(!checked);
                }
              }}
              orientation='horizontal'
            >
              <Checkbox
                checked={checked}
                id={fieldId}
                onCheckedChange={setChecked}
              />
              <FieldLabel
                className='cursor-pointer text-sm font-normal'
                htmlFor={fieldId}
              >
                {AUCTION_STATUS_LABEL[status]}
              </FieldLabel>
            </Field>
          );
        })}
      </div>
    </fieldset>
  );
}
