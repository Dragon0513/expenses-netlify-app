import type { LinksFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import expensesStyles from '~/styles/expenses.css';
import ExpensesHeader from '~/components/navigation/ExpensesHeader';

export default function ExpensesLayout() {
  return (
    <>
      <ExpensesHeader />
      <Outlet />
    </>
  );
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: expensesStyles },
];
