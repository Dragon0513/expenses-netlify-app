import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { type LoaderArgs, json } from '@remix-run/node';

import { getExpenses } from '~/utils/expenses.server';
import ExpensesStatistics from '~/components/expenses/ExpenseStatistics';
import Chart from '~/components/expenses/Chart';
import Error from '~/components/util/Error';
import { requireUserSession } from '~/utils/auth.server';

export default function ExpensesAnalysisPage() {
  const expenses = useLoaderData();

  return (
    <main>
      <Chart expenses={expenses} />
      <ExpensesStatistics expenses={expenses} />
    </main>
  );
}

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserSession(request);

  const expenses = await getExpenses(userId);

  if (!expenses || expenses.length === 0) {
    throw json(
      { message: 'Could not load expenses for the requested analysis.' },
      { status: 404, statusText: 'No expenses found' }
    );
  }

  return expenses;
}

export function ErrorBoundary() {
  const error: any = useRouteError();
  let errorMessage;
  let statusText = 'An error occurred';

  // if error is not a route error response, then returns this content
  if (!isRouteErrorResponse(error)) {
    errorMessage = error.message;
  } else if (isRouteErrorResponse(error)) {
    errorMessage =
      error.data.message || 'Something went wrong - could not load expenses.';
    statusText = error.statusText;
  }

  return (
    <main>
      <Error title={statusText}>
        <p>{errorMessage}</p>
      </Error>
    </main>
  );
}
