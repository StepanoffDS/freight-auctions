type AuctionStatus =
  | 'Draft'
  | 'Published'
  | 'Trading'
  | 'Finished'
  | 'Canceled'
  | 'Archived';

type AuctionSortField =
  | 'created_at'
  | 'loading_date'
  | 'current_price'
  | 'cargo_num';

type AuctionsSearchDefaults = {
  page: number;
  per_page: number;
  statuses: AuctionStatus[];
  sort_field: AuctionSortField;
  sort_direction: 'asc' | 'desc';
};

export const DEFAULT_AUCTIONS_SEARCH: AuctionsSearchDefaults = {
  page: 1,
  per_page: 10,
  statuses: [],
  sort_field: 'created_at',
  sort_direction: 'desc',
};
