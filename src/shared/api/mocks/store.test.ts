import { describe, expect, it } from 'vitest';

import { auctionMockStore } from './store';

describe('auctionMockStore.setBet', () => {
  it('returns 422 for invalid bet price', () => {
    const result = auctionMockStore.setBet(
      '00000000-0000-4000-8000-000000000301',
      { price: 90500 },
    );

    expect(result.status).toBe(422);
    expect(result.body).toMatchObject({
      code: 'VALIDATION_ERROR',
      errors: [{ field: 'price' }],
    });
  });

  it('updates auction detail and bets after successful bet', () => {
    const auctionUuid = '00000000-0000-4000-8000-000000000302';
    const result = auctionMockStore.setBet(auctionUuid, {
      comment: 'new price',
      price: 103000,
    });
    const detail = auctionMockStore.detail(auctionUuid);
    const bets = auctionMockStore.bets(auctionUuid);
    const myBet = bets?.items.find((bet) => bet.carrier.is_current_user);

    expect(result.status).toBe(200);
    expect(detail?.price.current_price).toBe(103000);
    expect(detail?.user_trading_status).toBe('Leading');
    expect(detail?.my_bet).toMatchObject({
      price: 103000,
      ranking_place: 1,
      status: 'Active',
    });
    expect(myBet).toMatchObject({
      price: 103000,
      ranking_place: 1,
      status: 'Active',
    });
    expect(bets?.participants_count).toBe(2);
  });
});
