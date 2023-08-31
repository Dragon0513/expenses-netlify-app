import { type ReactNode } from 'react';
import type { LinksFunction, V2_MetaFunction } from '@remix-run/node';
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useMatches,
  useRouteError,
} from '@remix-run/react';

import sharedStyles from '~/styles/shared.css';
import Error from './components/util/Error';

interface DocumentProps {
  title?: string;
  children: ReactNode;
}

export const meta: V2_MetaFunction = () => [{ title: 'RemixExpenses' }];

function Document({ title, children }: DocumentProps) {
  const matches = useMatches();

  const disableJS = matches.some((match) => match.handle?.disableJS);

  return (
    <html lang="en">
      <head>
        {title && <title>{title}</title>}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
        <ScrollRestoration />
        {!disableJS && <Scripts />}
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: sharedStyles },
];

export function ErrorBoundary() {
  const error: any = useRouteError();
  let errorMessage;
  let statusText = 'An error occurred';

  // if error is not a route error response, then returns this content
  if (!isRouteErrorResponse(error)) {
    errorMessage = error.message;
  } else if (isRouteErrorResponse(error)) {
    errorMessage =
      error.data.message || 'Something went wrong. Please try later.';
    statusText = error.statusText;
  }

  return (
    <Document title={statusText}>
      <main>
        <Error title={statusText}>
          <p>{errorMessage}</p>
          <p>
            Back to <Link to="/">safety</Link>.
          </p>
        </Error>
      </main>
    </Document>
  );
}
