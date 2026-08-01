import { HttpResponse, delay, http } from 'msw';

import { CONFIG } from '../../../model/config';
import type { ApiSchemas } from '../../schema';
import { auctionMockStore } from '../store';

const apiUrl = (path: string) => `${CONFIG.API_BASE_URL}${path}`;

export const auctionHandlers = [
  http.post(apiUrl('/auctions/list'), async ({ request }) => {
    const body = (await request.json()) as ApiSchemas['AuctionsListRequest'];

    await delay(1000);

    return HttpResponse.json(auctionMockStore.list(body));
  }),

  http.get(apiUrl('/auctions/:auctionUuid'), async ({ params }) => {
    await delay(1000);

    const auction = auctionMockStore.detail(String(params.auctionUuid));

    if (!auction) {
      return HttpResponse.json(
        { code: 'AUCTION_NOT_FOUND', message: 'Auction was not found.' },
        { status: 404 },
      );
    }

    return HttpResponse.json(auction);
  }),

  http.get(apiUrl('/auctions/:auctionUuid/bets'), async ({ params }) => {
    await delay(1000);

    const response = auctionMockStore.bets(String(params.auctionUuid));

    if (!response) {
      return HttpResponse.json(
        { code: 'AUCTION_NOT_FOUND', message: 'Auction was not found.' },
        { status: 404 },
      );
    }

    return HttpResponse.json(response);
  }),

  http.post(
    apiUrl('/auctions/:auctionUuid/bets'),
    async ({ params, request }) => {
      const result = auctionMockStore.setBet(
        String(params.auctionUuid),
        (await request.json()) as ApiSchemas['SetBetRequest'],
      );

      await delay(1000);

      return HttpResponse.json(result.body, { status: result.status });
    },
  ),
];
