import type {
  HeadersFunction,
  LinksFunction,
  LoaderArgs,
} from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import marketingStyles from '~/styles/marketing.css';
import MainHeader from '~/components/navigation/MainHeader';
import { getUserFromSession } from '~/utils/auth.server';

export default function MarketingLayout() {
  return (
    <>
      <MainHeader />
      <Outlet />
    </>
  );
}

/* Loads the userId from the cookie session and because
   this is a layout component we can access the userId
   from all components which are childs of this. */
export function loader({ request }: LoaderArgs) {
  return getUserFromSession(request);
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: marketingStyles },
];

export const headers: HeadersFunction = () => ({
  'Cache-Control': 'max-age=3600', // Cache the page for 60 minutes
});
