import { AUCTION_STATUS_LABEL, AUCTION_STATUSES } from '@/entities/auction';
import { Checkbox } from '@/shared/ui/kit/checkbox';
import { Field, FieldLabel } from '@/shared/ui/kit/field';
import type { AuctionsSearchParams } from '../model/search-params';

type AuctionFiltersStatusesProps = {
  value: AuctionsSearchParams;
  onChange: (patch: Partial<AuctionsSearchParams>) => void;
};

export function AuctionFiltersStatuses({
  onChange,
  value,
}: AuctionFiltersStatusesProps) {
  return (
    <fieldset className='grid gap-2 border-t pt-4'>
      <legend className='text-sm font-medium '>Мультистатус</legend>
      <div className='flex flex-wrap gap-2'>
        {AUCTION_STATUSES.map((status) => {
          const fieldId = `auction-status-${status}`;
          const checked = value.statuses.includes(status);
          const setChecked = (nextChecked: boolean) => {
            const statuses = nextChecked
              ? [...value.statuses, status]
              : value.statuses.filter((item) => item !== status);

            onChange({ status: undefined, statuses });
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
