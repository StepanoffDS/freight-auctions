import type { UseFormSetError } from 'react-hook-form';
import { z } from 'zod';

import { formatMoney } from '@/entities/auction';
import { ApiError, type AuctionDetailDto } from '@/shared/api';

export type BetFormValues = {
  comment: string;
  price: string;
};

export function buildBetSchema(auction: AuctionDetailDto) {
  return z
    .object({
      comment: z.string().trim().optional(),
      price: z.string().trim().min(1, 'Введите цену'),
    })
    .transform((values) => ({
      comment: values.comment || null,
      price: Number(values.price),
    }))
    .refine((values) => Number.isFinite(values.price), {
      message: 'Введите корректную цену',
      path: ['price'],
    })
    .refine((values) => values.price > 0, {
      message: 'Цена должна быть больше 0',
      path: ['price'],
    })
    .refine(
      (values) =>
        auction.price.min_bet_price == null ||
        values.price >= auction.price.min_bet_price,
      {
        message: `Цена ниже минимума ${formatMoney(
          auction.price.min_bet_price,
          auction.price.currency,
        )}`,
        path: ['price'],
      },
    )
    .refine(
      (values) =>
        auction.price.max_bet_price == null ||
        values.price <= auction.price.max_bet_price,
      {
        message: `Цена выше максимума ${formatMoney(
          auction.price.max_bet_price,
          auction.price.currency,
        )}`,
        path: ['price'],
      },
    )
    .refine(
      (values) =>
        auction.price.bet_step == null ||
        auction.price.min_bet_price == null ||
        Number.isInteger(
          (values.price - auction.price.min_bet_price) / auction.price.bet_step,
        ),
      {
        message: `Цена должна соответствовать шагу ${formatMoney(
          auction.price.bet_step,
          auction.price.currency,
        )}`,
        path: ['price'],
      },
    );
}

export function applyValidationError(
  error: unknown,
  setError: UseFormSetError<BetFormValues>,
) {
  if (!(error instanceof ApiError) || error.status !== 422) {
    return false;
  }

  const payload = error.payload;

  if (!payload || typeof payload !== 'object' || !('errors' in payload)) {
    return false;
  }

  const errors = payload.errors;

  if (!Array.isArray(errors)) {
    return false;
  }

  errors.forEach((item) => {
    if (
      item &&
      typeof item === 'object' &&
      'field' in item &&
      item.field === 'price' &&
      'message' in item &&
      typeof item.message === 'string'
    ) {
      setError('price', { message: item.message, type: 'server' });
    }
  });

  return true;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Повторите попытку позже.';
}
