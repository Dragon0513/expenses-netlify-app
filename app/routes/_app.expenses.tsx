import { json, type HeadersFunction, type LoaderArgs } from '@remix-run/node';
import { Outlet, Link, useLoaderData } from '@remix-run/react';
import { FaPlus, FaDownload } from 'react-icons/fa';

import ExpensesList from '~/components/expenses/ExpensesList';
import { requireUserSession } from '~/utils/auth.server';
import { getExpenses } from '~/utils/expenses.server';

export default function ExpensesPage() {
  const expenses = useLoaderData();
  const hasExpenses = expenses && expenses.length > 0;

  return (
    <>
      <Outlet />
      <main>
        <section id="expenses-actions">
          <Link to="add">
            <FaPlus />
            <span>Add Expenses</span>
          </Link>
          <a href="/expenses/raw">
            <FaDownload />
            <span>Load Raw Data</span>
          </a>
        </section>
        {hasExpenses && <ExpensesList expenses={expenses} />}
        {!hasExpenses && (
          <section id="no-expenses">
            <h1>No expenses found</h1>
            <p>
              Start <Link to="add">adding some</Link> today.
            </p>
          </section>
        )}
      </main>
    </>
  );
}

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserSession(request);

  const expenses = await getExpenses(userId);

  return json(expenses, { headers: { 'Cache-Control': 'max-age=3' } });
}

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control')!,
});
