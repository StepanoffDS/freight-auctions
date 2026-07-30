export const ROUTES = {
  HOME: '/',
  AUCTIONS: '/auctions',
  AUCTION: '/auctions/$auctionUuid',
  AUCTION_BET: '/auctions/$auctionUuid/bet',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
