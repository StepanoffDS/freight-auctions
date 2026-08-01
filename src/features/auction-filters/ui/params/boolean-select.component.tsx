import { SelectField } from './select-field.component';

type BooleanSelectProps = {
  label: string;
  onChange: (value: boolean | undefined) => void;
  value?: boolean;
};

export function BooleanSelect({
  label,
  onChange,
  value,
}: BooleanSelectProps) {
  return (
    <SelectField
      label={label}
      onChange={(nextValue) =>
        onChange(nextValue === undefined ? undefined : nextValue === 'true')
      }
      options={[
        { label: 'Да', value: 'true' },
        { label: 'Нет', value: 'false' },
      ]}
      value={value == null ? undefined : String(value)}
    />
  );
}
