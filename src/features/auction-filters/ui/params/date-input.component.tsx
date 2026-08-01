import { CalendarIcon } from 'lucide-react';
import { useId, useState } from 'react';

import {
  formatDateLabel,
  formatDateParamForUrl,
  parseDateFromUrl,
} from '@/features/auction-filters/lib/date-param';
import { Button } from '@/shared/ui/kit/button';
import { Calendar } from '@/shared/ui/kit/calendar';
import { Field, FieldLabel } from '@/shared/ui/kit/field';

type DateInputProps = {
  label: string;
  onChange: (value: string | undefined) => void;
  value?: string;
};

export function DateInput({ label, onChange, value }: DateInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputId = useId();
  const selectedDate = parseDateFromUrl(value);

  return (
    <Field className='relative gap-1 text-sm'>
      <FieldLabel className='font-medium' htmlFor={inputId}>
        {label}
      </FieldLabel>
      <Button
        className='h-10 justify-start rounded-md px-3 text-sm font-normal'
        id={inputId}
        onClick={() => setIsOpen((open) => !open)}
        type='button'
        variant='outline'
      >
        <CalendarIcon className='size-4' />
        {selectedDate ? formatDateLabel(selectedDate) : 'Выберите дату'}
      </Button>
      {isOpen && (
        <div className='absolute top-full z-50 mt-1 rounded-md border bg-popover p-2 shadow-md'>
          <Calendar
            mode='single'
            onSelect={(date) => {
              onChange(date ? formatDateParamForUrl(date) : undefined);
              setIsOpen(false);
            }}
            selected={selectedDate}
          />
          {value && (
            <Button
              className='mt-2 w-full rounded-md'
              onClick={() => {
                onChange(undefined);
                setIsOpen(false);
              }}
              type='button'
              variant='outline'
            >
              Очистить
            </Button>
          )}
        </div>
      )}
    </Field>
  );
}
