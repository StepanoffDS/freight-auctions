import { Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { DEFAULT_AUCTIONS_SEARCH } from '@/shared/model/auctions';
import { ROUTES } from '@/shared/model/routes';

export function RootLayout() {
  return (
    <main className='min-h-screen bg-background text-foreground'>
      <header className='border-b bg-card'>
        <nav className='mx-auto flex max-w-6xl items-center gap-4 px-4 py-3'>
          <Link
            to={ROUTES.AUCTIONS}
            search={DEFAULT_AUCTIONS_SEARCH}
            className='text-sm font-medium text-muted-foreground'
            activeProps={{ className: 'text-foreground' }}
          >
            Аукционы
          </Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools position='bottom-right' />
    </main>
  );
}

export function RootNotFound() {
  return (
    <section className='mx-auto max-w-6xl px-4 py-10'>
      <h1 className='text-2xl font-semibold'>Страница не найдена</h1>
      <Link
        to={ROUTES.AUCTIONS}
        search={DEFAULT_AUCTIONS_SEARCH}
        className='mt-4 inline-block text-primary'
      >
        Вернуться к аукционам
      </Link>
    </section>
  );
}
