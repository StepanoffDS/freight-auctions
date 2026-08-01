import { useId } from 'react';

import { Field, FieldLabel } from '@/shared/ui/kit/field';
import { Input } from '@/shared/ui/kit/input';

import { useTextInputDebounce } from '../../model/use-text-input-debounce';

type TextInputProps = {
  debounceMs?: number;
  label: string;
  onChange: (value: string | undefined) => void;
  value?: string;
};

export function TextInput({
  debounceMs,
  label,
  onChange,
  value,
}: TextInputProps) {
  const inputId = useId();
  const valueText = value ?? '';
  const { inputValue, setInputValue } = useTextInputDebounce({
    valueText,
    debounceMs,
    onChange,
  });

  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value;

    if (debounceMs == null) {
      onChange(nextValue || undefined);
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
        onChange={inputChange}
        placeholder='UL-2026'
        value={debounceMs == null ? valueText : inputValue}
      />
    </Field>
  );
}
