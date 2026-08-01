import { useState } from 'react';

import { Button } from '@/shared/ui/kit/button';

import type { AuctionsSearchParams } from '../model/search-params';
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
  const [resetKey, setResetKey] = useState(0);

  return (
    <section className='grid gap-4 rounded-md border bg-card p-4'>
      <AuctionFiltersParams
        onChange={onChange}
        resetKey={resetKey}
        value={value}
      />

      <AuctionFiltersStatuses onChange={onChange} value={value} />

      <div className='flex justify-end'>
        <Button
          className='h-10 rounded-md px-4 text-sm'
          onClick={() => {
            setResetKey((key) => key + 1);
            onReset();
          }}
          type='button'
          variant='outline'
        >
          Сбросить
        </Button>
      </div>
    </section>
  );
}
