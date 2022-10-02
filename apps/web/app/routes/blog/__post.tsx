import { json, LoaderFunction, Outlet, useLoaderData } from "remix";
import { Ellipsis } from "~/components/Ellipsis";
import { ENABLE_APP_LINKS } from "~/utils/constants";
import { overlayBackgroundColor } from "~/config/colors";
import { Header } from "~/components/Header";
import invariant from "tiny-invariant";

import heroImage from "~/images/hero.jpg";

import { getPosts, getPost } from "~/services/blog.server";
import { PageContainer } from "~/components/PageContainer";
import { Card } from "~/components/Card";

type LoaderData = {
  post: Awaited<ReturnType<typeof getPost>>;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  // invariant(params.slug, "Expected params.slug");
  const slugParts = request.url.split("/");
  const slug = slugParts[slugParts.length - 1];
  return json<LoaderData>({
    post: await getPost(slug),
  });
};

// https://remix.run/guides/routing#index-routes
export default function Blog() {
  const { post } = useLoaderData();
  return (
    <Card>
      <article className="prose lg:prose-xl">
        <Outlet />
      </article>
    </Card>
  );
}
