import { useDebounceCallback } from '@/shared/hooks/useDebounceCallback/useDebounceCallback';

import type { AuctionsSearchParams } from './search-params';

const FILTER_INPUT_DEBOUNCE_MS = 500;

export type DebouncedFiltersChange = {
  cancel: () => void;
  changeCargoNum: (value: AuctionsSearchParams['cargo_num']) => void;
  changePriceFrom: (value: AuctionsSearchParams['price_from']) => void;
  changePriceTo: (value: AuctionsSearchParams['price_to']) => void;
};

export function useDebouncedFiltersChange(
  onChange: (patch: Partial<AuctionsSearchParams>) => void,
): DebouncedFiltersChange {
  const changeCargoNum = useDebounceCallback(
    (cargo_num: AuctionsSearchParams['cargo_num']) => onChange({ cargo_num }),
    FILTER_INPUT_DEBOUNCE_MS,
  );
  const changePriceFrom = useDebounceCallback(
    (price_from: AuctionsSearchParams['price_from']) =>
      onChange({ price_from }),
    FILTER_INPUT_DEBOUNCE_MS,
  );
  const changePriceTo = useDebounceCallback(
    (price_to: AuctionsSearchParams['price_to']) => onChange({ price_to }),
    FILTER_INPUT_DEBOUNCE_MS,
  );

  const cancel = () => {
    changeCargoNum.cancel();
    changePriceFrom.cancel();
    changePriceTo.cancel();
  };

  return {
    cancel,
    changeCargoNum,
    changePriceFrom,
    changePriceTo,
  };
}
