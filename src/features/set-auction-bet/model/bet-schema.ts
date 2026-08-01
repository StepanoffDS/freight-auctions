import { z } from 'zod';

import { formatMoney } from '@/entities/auction';
import { type AuctionDetailDto } from '@/shared/api';

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
