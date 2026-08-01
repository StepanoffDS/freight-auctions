import { createContext, useContext } from 'react';

import type { AuctionsSearchParams } from './search-params';
import type { DebouncedFiltersChange } from './use-debounced-filters-change';

export type AuctionFiltersContextValue = {
  debouncedChange: DebouncedFiltersChange;
  onChange: (patch: Partial<AuctionsSearchParams>) => void;
};

export const AuctionFiltersContext =
  createContext<AuctionFiltersContextValue | null>(null);

export function useAuctionFiltersContext() {
  const context = useContext(AuctionFiltersContext);

  if (!context) {
    throw new Error('useAuctionFiltersContext must be used inside filters');
  }

  return context;
}
