import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json, Link } from "remix";
import thanksImage from "~/images/wilhelm-gunkel-AKQlYooS72w-unsplash.jpg";

type IndexData = {
  resources: Array<{ name: string; url: string }>;
  demos: Array<{ name: string; to: string }>;
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Reported! Thanks!",
    description: "The user has been reported. We will review the case shortly.",
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  let data = useLoaderData<IndexData>();

  return (
    <div className="remix__page">
      <main>
        <section className="body-font text-gray-600">
          <div className="container mx-auto flex flex-col items-center justify-center px-5 py-24">
            <img
              className="mb-10 w-5/6 rounded object-cover object-center md:w-3/6 lg:w-2/6"
              alt="hero"
              src={thanksImage}
            />
            <div className="hero-content w-5/6 text-center md:w-3/6 lg:w-2/6">
              <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 sm:text-4xl">
                Thank You!!!
              </h1>
              <p className="mb-8 leading-relaxed">
                We are sorry you had to deal with what you reported. We will be
                looking into the matter shortly.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
