import { create } from 'zustand';

export const AUCTION_FILTERS_PANEL = 'auction-filters';

type AuctionFiltersUiState = {
  openPanels: string[];
  setOpenPanels: (openPanels: string[]) => void;
};

export const useAuctionFiltersUiStore = create<AuctionFiltersUiState>(
  (set) => ({
    openPanels: [AUCTION_FILTERS_PANEL],
    setOpenPanels: (openPanels) => set({ openPanels }),
  }),
);
