import type { ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/kit/card';

export function Section({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className='grid gap-4'>{children}</CardContent>
    </Card>
  );
}
