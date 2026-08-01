import { describe, expect, it } from 'vitest';

import { auctionMockStore } from '@/shared/api/mocks/store';

import { buildBetSchema } from './bet-schema';

const auctionUuid = '00000000-0000-4000-8000-000000000301';

function getAuction() {
  const auction = auctionMockStore.detail(auctionUuid);

  if (!auction) {
    throw new Error('Test auction is missing');
  }

  return structuredClone(auction);
}

function getPriceError(price: string) {
  const result = buildBetSchema(getAuction()).safeParse({
    comment: '',
    price,
  });

  if (result.success) {
    return null;
  }

  return result.error.issues.find((issue) => issue.path[0] === 'price')
    ?.message;
}

describe('buildBetSchema', () => {
  it('requires price', () => {
    expect(getPriceError('')).toBe('Введите цену');
  });

  it('rejects non-positive price', () => {
    expect(getPriceError('0')).toBe('Цена должна быть больше 0');
  });

  it('rejects price below minimum', () => {
    expect(getPriceError('89000')).toBe('Цена ниже минимума 90 000 ₽');
  });

  it('rejects price above maximum', () => {
    expect(getPriceError('151000')).toBe('Цена выше максимума 150 000 ₽');
  });

  it('rejects price that does not match step', () => {
    expect(getPriceError('90500')).toBe(
      'Цена должна соответствовать шагу 1 000 ₽',
    );
  });

  it('returns SetBetRequest-compatible data for a valid price', () => {
    const result = buildBetSchema(getAuction()).safeParse({
      comment: ' срочно ',
      price: '119000',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({
        comment: 'срочно',
        price: 119000,
      });
    }
  });
});
