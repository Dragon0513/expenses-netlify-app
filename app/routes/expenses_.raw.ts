// This is a resource route, which returns only data

import { type LoaderArgs } from '@remix-run/node';
import { requireUserSession } from '~/utils/auth.server';
import { getExpenses } from '~/utils/expenses.server';

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserSession(request);

  return getExpenses(userId);
}
