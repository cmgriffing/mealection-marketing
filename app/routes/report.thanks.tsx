import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json, Link } from "remix";
import thanksImage from "../../images/wilhelm-gunkel-AKQlYooS72w-unsplash.jpg";

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
        <section className="text-gray-600 body-font">
          <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
            <img
              className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded"
              alt="hero"
              src={thanksImage}
            />
            <div className="hero-content text-center lg:w-2/6 md:w-3/6 w-5/6">
              <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
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