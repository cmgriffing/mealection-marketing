import {
  Link,
  Links,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useHref,
  useLocation,
} from "remix";
import type { LinksFunction } from "remix";

import overridesUrl from "./styles/overrides.css";
import tailwindUrl from "./styles/tailwind.css";
import { createStore, persist, StoreProvider } from "easy-peasy";
import { AuthStore } from "./stores/auth";

const store = createStore({
  auth: persist({
    token: "",
    user: {
      name: "",
    },
  }),
  app: {},
});

// https://remix.run/api/app#links
export let links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindUrl },
    { rel: "stylesheet", href: overridesUrl },
    { rel: "stylesheet", href: "/fontsource/nunito/index.css" },
    { rel: "stylesheet", href: "/fontsource/bevan/index.css" },
    {
      rel: "apple-touch-icon",
      sizes: "57x57",
      href: "/apple-icon-57x57.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "60x60",
      href: "/apple-icon-60x60.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "72x72",
      href: "/apple-icon-72x72.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "76x76",
      href: "/apple-icon-76x76.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "114x114",
      href: "/apple-icon-114x114.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "120x120",
      href: "/apple-icon-120x120.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "144x144",
      href: "/apple-icon-144x144.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "152x152",
      href: "/apple-icon-152x152.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-icon-180x180.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "192x192",
      href: "/android-icon-192x192.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "96x96",
      href: "/favicon-96x96.png",
    },

    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    {
      rel: "manifest",
      href: "/manifest.json",
    },
  ];
};

export const meta: MetaFunction = () => {
  return {
    title: "Mealection",
    description:
      "Stop wasting time figuring out what to eat by feeling like a census taker and automate the voting process.",
    "msapplication-TileColor": "#FFFFFF",
    "theme-color": "#FFFFFF",
    "msapplication-TileImage": "/ms-icon-144x144.png",
    "og:title": "Mealection",
    "og:type": "website",
    "og:description":
      "It can be a hassle to get family or friends to agree on what or where to eat.Take a vote for takeout. Hold an election for home cooked meals.",
    "og:image": "https://mealection.com/twitter-card.jpg",
    "twitter:image": "https://mealection.com/twitter-card.jpg",
    "og:url": "https://mealection.com",
    "twitter:card": "summary_large_image",
  };
};

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <script
          defer
          data-domain="mealection.com"
          src="https://plausible.io/js/plausible.js"
        ></script>
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  let isAdmin = location.pathname.indexOf("admin") === 0;

  return (
    <StoreProvider store={AuthStore}>
      <div className="remix-app min-h-screen flex flex-col flex-grow">
        <div className="remix-app__main flex flex-col flex-grow">
          <div className="remix-app__main-content  flex flex-col flex-grow">
            {children}
          </div>
        </div>
        {isAdmin && (
          <footer className="remix-app__footer">
            <div className="container remix-app__footer-content text-center">
              <p>&copy; {new Date().getFullYear()} Mealection</p>
            </div>
          </footer>
        )}
      </div>
    </StoreProvider>
  );
}
