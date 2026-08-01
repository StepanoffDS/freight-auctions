import { FormProvider, useForm } from 'react-hook-form';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/kit/accordion';
import { Button } from '@/shared/ui/kit/button';

import { AuctionFiltersContext } from '../model/auction-filters-context';
import {
  AUCTION_FILTERS_PANEL,
  useAuctionFiltersUiStore,
} from '../model/auction-filters-ui.store';
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
  const { openPanels, setOpenPanels } = useAuctionFiltersUiStore();

  return (
    <FormProvider {...form}>
      <AuctionFiltersContext.Provider value={{ debouncedChange, onChange }}>
        <section className='grid gap-4 rounded-md border bg-card p-4'>
          <Accordion onValueChange={setOpenPanels} value={openPanels}>
            <AccordionItem className='border-0' value={AUCTION_FILTERS_PANEL}>
              <AccordionTrigger className='py-0 text-sm'>
                Фильтры
              </AccordionTrigger>
              <AccordionContent className='grid gap-4 pt-4 pb-0'>
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </AuctionFiltersContext.Provider>
    </FormProvider>
  );
}
