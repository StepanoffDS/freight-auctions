import { useEffect, useRef, useState } from 'react';

import { useDebounceValue } from '@/shared/hooks/useDebounceValue/useDebounceValue';

export function useTextInputDebounce<T>({
  valueText,
  debounceMs,
  onChange,
}: {
  valueText: T;
  debounceMs?: number;
  onChange: (value: T | undefined) => void;
}) {
  const [draft, setDraft] = useState<{ sourceValue: T; value: T | undefined }>({
    sourceValue: valueText,
    value: valueText,
  });
  const inputValue = draft.sourceValue === valueText ? draft.value : valueText;
  const debouncedValue = useDebounceValue(inputValue, debounceMs ?? 0);
  const previousDebouncedValueRef = useRef(valueText);

  useEffect(() => {
    previousDebouncedValueRef.current = valueText;
  }, [valueText]);

  useEffect(() => {
    if (
      debounceMs == null ||
      previousDebouncedValueRef.current === debouncedValue
    ) {
      return;
    }

    previousDebouncedValueRef.current = debouncedValue!;
    onChange(debouncedValue || undefined);
  }, [debounceMs, debouncedValue, onChange]);

  return {
    inputValue,
    setInputValue: (value: T) => setDraft({ sourceValue: valueText, value }),
  };
}
