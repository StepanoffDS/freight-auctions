import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/kit/button';

import { AuctionFiltersContext } from '../model/auction-filters-context';
import {
  type AuctionsSearchParams,
  DEFAULT_AUCTIONS_SEARCH,
} from '../model/search-params';
import { useDebouncedFiltersChange } from '../model/use-debounced-filters-change';
import { AuctionFiltersParams } from './auction-filters-params.component';
import { AuctionFiltersStatuses } from './auction-filters-statuses.component';

type AuctionsFiltersProps = {
  value: AuctionsSearchParams;
  onChange: (patch: Partial<AuctionsSearchParams>) => void;
  onReset: () => void;
};

export function AuctionFilters({
  onChange,
  onReset,
  value,
}: AuctionsFiltersProps) {
  const form = useForm<AuctionsSearchParams>({ values: value });
  const { reset } = form;
  const debouncedChange = useDebouncedFiltersChange(onChange);

  return (
    <FormProvider {...form}>
      <AuctionFiltersContext.Provider value={{ debouncedChange, onChange }}>
        <section className='grid gap-4 rounded-md border bg-card p-4'>
          <AuctionFiltersParams />

          <AuctionFiltersStatuses />

          <div className='flex justify-end'>
            <Button
              className='h-10 rounded-md px-4 text-sm'
              onClick={() => {
                debouncedChange.cancel();
                reset(DEFAULT_AUCTIONS_SEARCH);
                onReset();
              }}
              type='button'
              variant='outline'
            >
              Сбросить
            </Button>
          </div>
        </section>
      </AuctionFiltersContext.Provider>
    </FormProvider>
  );
}
