export function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat('ru-RU').format(new Date(value)) : '-';
}

export function formatMoney(value: number | null, currency = 'RUB') {
  return value == null
    ? 'скрыта'
    : new Intl.NumberFormat('ru-RU', {
        currency,
        maximumFractionDigits: 0,
        style: 'currency',
      }).format(value);
}

export function formatNumber(value: number | null, suffix: string) {
  return value == null ? '-' : `${value.toLocaleString('ru-RU')} ${suffix}`;
}
