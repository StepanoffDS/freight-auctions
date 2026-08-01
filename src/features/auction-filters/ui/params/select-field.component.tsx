import { useId } from 'react';

import { Field, FieldLabel } from '@/shared/ui/kit/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/kit/select';

const ALL_VALUE = 'Все';

type SelectFieldProps = {
  label: string;
  onChange: (value: string | undefined) => void;
  options: { label: string; value: string }[];
  value?: string;
};

export function SelectField({
  label,
  onChange,
  options,
  value,
}: SelectFieldProps) {
  const inputId = useId();
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? ALL_VALUE;

  return (
    <Field className='gap-1 text-sm'>
      <FieldLabel className='font-medium' htmlFor={inputId}>
        {label}
      </FieldLabel>
      <Select
        onValueChange={(nextValue) =>
          onChange(
            nextValue == null || nextValue === ALL_VALUE
              ? undefined
              : String(nextValue),
          )
        }
        value={value ?? ALL_VALUE}
      >
        <SelectTrigger
          className='h-10 w-full rounded-md text-sm data-[size=default]:h-10'
          id={inputId}
        >
          <SelectValue>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Все</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
