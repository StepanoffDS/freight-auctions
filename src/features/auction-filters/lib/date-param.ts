export function parseDateFromUrl(value?: string) {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split('-').map(Number);

  return new Date(year, month - 1, day);
}

export function formatDateParamForUrl(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat('ru-RU').format(date);
}
