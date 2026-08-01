import { Button } from '@/shared/ui/kit/button';
import { Field, FieldLabel } from '@/shared/ui/kit/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/kit/select';

type AuctionPaginationProps = {
  perPage: number;
  page: number;
  pages: number;
  total: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
};

export function AuctionPagination({
  onPageChange,
  onPerPageChange,
  page,
  pages,
  perPage,
  total,
}: AuctionPaginationProps) {
  const safePages = Math.max(1, pages);
  const perPageId = 'auction-pagination-per-page';

  return (
    <nav className='flex flex-col gap-3 rounded-md border bg-card p-4 text-sm sm:flex-row sm:items-center sm:justify-between'>
      <div className='text-muted-foreground'>
        Страница {page} из {safePages}, всего {total}
      </div>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
        <Field className='flex-row items-center gap-2' orientation='horizontal'>
          <FieldLabel
            className='text-sm font-normal text-muted-foreground'
            htmlFor={perPageId}
          >
            Строк на странице
          </FieldLabel>
          <Select
            onValueChange={(value) => {
              if (value != null) {
                onPerPageChange(Number(value));
              }
            }}
            value={String(perPage)}
          >
            <SelectTrigger
              className='h-10 w-24 rounded-md text-sm data-[size=default]:h-10'
              id={perPageId}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2, 5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Button
          className='h-10 rounded-md px-4'
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          type='button'
          variant='outline'
        >
          Назад
        </Button>
        <Button
          className='h-10 rounded-md px-4'
          disabled={page >= safePages}
          onClick={() => onPageChange(page + 1)}
          type='button'
          variant='outline'
        >
          Вперед
        </Button>
      </div>
    </nav>
  );
}
