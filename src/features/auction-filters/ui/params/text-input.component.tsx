import { useId } from 'react';

import { Field, FieldLabel } from '@/shared/ui/kit/field';
import { Input } from '@/shared/ui/kit/input';

type TextInputProps = {
  label: string;
  onChange: (value: string | undefined) => void;
  value?: string;
};

export function TextInput({ label, onChange, value }: TextInputProps) {
  const inputId = useId();
  const valueText = value ?? '';

  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value;
    onChange(nextValue || undefined);
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
        value={valueText}
      />
    </Field>
  );
}
