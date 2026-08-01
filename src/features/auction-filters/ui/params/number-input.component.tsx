import { useId } from 'react';

import { Field, FieldLabel } from '@/shared/ui/kit/field';
import { Input } from '@/shared/ui/kit/input';

type NumberInputProps = {
  label: string;
  onChange: (value: number | undefined) => void;
  value?: number;
};

export function NumberInput({
  label,
  onChange,
  value,
}: NumberInputProps) {
  const inputId = useId();
  const valueText = value?.toString() ?? '';

  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseNumber(event.currentTarget.value));
  };

  return (
    <Field className='gap-1 text-sm'>
      <FieldLabel className='font-medium' htmlFor={inputId}>
        {label}
      </FieldLabel>
      <Input
        className='h-10 rounded-md bg-background px-3 text-sm md:text-sm'
        id={inputId}
        min={0}
        onChange={inputChange}
        type='number'
        value={valueText}
      />
    </Field>
  );
}

function parseNumber(value?: string) {
  return value ? Number(value) : undefined;
}
