import { MOCK_CITIES } from '@/entities/city';
import { SelectField } from './select-field.component';

type CitySelectProps = {
  label: string;
  onChange: (value: string | undefined) => void;
  value?: string;
};

export function CitySelect({ label, onChange, value }: CitySelectProps) {
  return (
    <SelectField
      label={label}
      onChange={onChange}
      options={MOCK_CITIES.map((city) => ({
        label: city.name,
        value: city.uuid,
      }))}
      value={value}
    />
  );
}
