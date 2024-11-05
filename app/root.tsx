import type { LinksFunction } from "@remix-run/node";
import {
  Form,
  json,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import appStylesHref from "./app.css?url";
import { getCats } from "./data";


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export const loader = async () => {
  const cats = await getCats();
  return json({ cats });
};

export default function App() {
  const { cats } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Cats</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search cats"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {cats.length ? (
              <ul>
                {cats.map((cat) => (
                  <li key={cat.id}>
                    <Link to={`cats/${cat.id}`}>
                      {cat.first || cat.last ? (
                        <>
                          {cat.first} {cat.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {cat.favorite ? (
                        <span>★</span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No cats</i>
              </p>
            )}
          </nav>
        </div>
        <div id="detail">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
