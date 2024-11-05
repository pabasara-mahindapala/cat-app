import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import type { FunctionComponent } from "react";

import { getCat, type CatRecord } from "../data";
import invariant from "tiny-invariant";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.catId, "Missing catId param");
  const cat = await getCat(params.catId);
  if (!cat) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ cat });
};

export default function Cat() {
  const { cat } = useLoaderData<typeof loader>();

  return (
    <div id="cat">
      <div>
        <img
          alt={`${cat.first} ${cat.last} avatar`}
          key={cat.avatar}
          src={cat.avatar}
        />
      </div>

      <div>
        <h1>
          {cat.first || cat.last ? (
            <>
              {cat.first} {cat.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite cat={cat} />
        </h1>

        {cat.twitter ? (
          <p>
            <a
              href={`https://twitter.com/${cat.twitter}`}
            >
              {cat.twitter}
            </a>
          </p>
        ) : null}

        {cat.notes ? <p>{cat.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  cat: Pick<CatRecord, "favorite">;
}> = ({ cat }) => {
  const favorite = cat.favorite;

  return (
    <Form method="post">
      <button
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
};
