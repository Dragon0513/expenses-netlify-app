import { json, type ActionArgs } from '@remix-run/node';
import { destroyUserSession } from '~/utils/auth.server';

export function action({ request }: ActionArgs) {
  if (request.method !== 'POST') {
    throw json({ message: 'Invalid request method' }, { status: 400 });
  }

  return destroyUserSession(request);
}
