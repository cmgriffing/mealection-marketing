import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json, Link } from "remix";
import { AdminPage } from "~/components/admin/AdminPage";

type IndexData = {
  resources: Array<{ name: string; url: string }>;
  demos: Array<{ name: string; to: string }>;
};

export let loader: LoaderFunction = async (foo) => {
  const { request } = foo;

  return {};
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Thanks",
    description:
      "Thank you for signing up for the Mealection release announcements.",
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  let data = useLoaderData<IndexData>();

  return (
    <AdminPage>
      <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
        user.$id
      </h1>
    </AdminPage>
  );
}
