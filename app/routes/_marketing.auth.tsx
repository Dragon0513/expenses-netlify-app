import type {
  HeadersFunction,
  ActionArgs,
  LinksFunction,
} from '@remix-run/node';

import authStyles from '~/styles/auth.css';
import AuthForm from '~/components/auth/AuthForm';
import { validateCredentials } from '~/utils/validation.server';
import { login, signup } from '~/utils/auth.server';

export default function AuthPage() {
  return <AuthForm />;
}

export async function action({ request }: ActionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get('mode') || 'login';

  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  try {
    validateCredentials(credentials);
  } catch (error) {
    return error;
  }

  try {
    if (authMode === 'login') {
      return await login({
        email: credentials.email,
        password: credentials.password,
      });
    } else {
      return await signup({
        email: credentials.email,
        password: credentials.password,
      });
    }
  } catch (error: any) {
    if (error.status === 422) {
      return { credentials: error.message };
    }
  }
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: authStyles },
];

export const headers: HeadersFunction = ({ parentHeaders }) => ({
  'Cache-Control': parentHeaders.get('Cache-Control')!,
});
