import { createRootRoute, createRoute, redirect } from '@tanstack/react-router';

import { AuctionBetPage } from '@/pages/auction-bet';
import { AuctionDetailPage } from '@/pages/auction-detail';
import {
  AuctionsListPage,
  auctionsSearchSchema,
  buildAuctionsListRequest,
} from '@/pages/auctions';
import { auctionQueries, queryClient } from '@/shared/api';
import { DEFAULT_AUCTIONS_SEARCH } from '@/shared/model/auctions';
import { ROUTES } from '@/shared/model/routes';
import { RootLayout, RootNotFound } from '../layouts/root-layout.component';

export const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: RootNotFound,
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: ROUTES.AUCTIONS, search: DEFAULT_AUCTIONS_SEARCH });
  },
});

export const auctionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auctions',
  validateSearch: (search) => auctionsSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({
    request: buildAuctionsListRequest(search),
  }),
  loader: ({ deps }) =>
    queryClient.ensureQueryData(auctionQueries.list(deps.request)),
  component: AuctionsListPage,
});

export const auctionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auctions/$auctionUuid',
  loader: ({ params }) =>
    queryClient.ensureQueryData(auctionQueries.detail(params.auctionUuid)),
  component: AuctionDetailPage,
});

export const auctionBetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auctions/$auctionUuid/bet',
  loader: ({ params }) =>
    queryClient.ensureQueryData(auctionQueries.detail(params.auctionUuid)),
  component: AuctionBetPage,
});
