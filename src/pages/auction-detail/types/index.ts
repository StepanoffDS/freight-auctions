import type { AuctionDetailDto } from '@/shared/api/auctions';

export type Contact = NonNullable<
  AuctionDetailDto['contacts']['items'][number]
>;
