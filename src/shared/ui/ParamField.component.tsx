import type { ReactNode } from 'react';

export function ParamField({
  label,
  value,
}: {
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <div className='min-w-0'>
      <div className='text-xs font-medium uppercase text-muted-foreground'>
        {label}
      </div>
      <div className='mt-1 break-words'>{value}</div>
    </div>
  );
}
