import { useId } from 'react';

import { Field, FieldLabel } from '@/shared/ui/kit/field';
import { Input } from '@/shared/ui/kit/input';

import { useTextInputDebounce } from '../../model/use-text-input-debounce';

type NumberInputProps = {
  debounceMs?: number;
  label: string;
  onChange: (value: number | undefined) => void;
  value?: number;
};

export function NumberInput({
  debounceMs,
  label,
  onChange,
  value,
}: NumberInputProps) {
  const inputId = useId();
  const valueText = value ?? 0;
  const { inputValue, setInputValue } = useTextInputDebounce({
    valueText,
    debounceMs,
    onChange,
  });

  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.currentTarget.value);

    if (debounceMs == null) {
      onChange(nextValue);
      return;
    }

    setInputValue(nextValue);
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
        value={debounceMs == null ? valueText : inputValue}
      />
    </Field>
  );
}

function parseNumber(value?: string) {
  return value ? Number(value) : undefined;
}
