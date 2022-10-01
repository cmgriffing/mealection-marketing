import { json, LoaderFunction, Outlet, useLoaderData } from "remix";
import { Ellipsis } from "~/components/Ellipsis";
import { ENABLE_APP_LINKS } from "~/utils/constants";
import { overlayBackgroundColor } from "~/config/colors";
import { Header } from "~/components/Header";
import invariant from "tiny-invariant";

import heroImage from "~/images/hero.jpg";

import { getPosts, getPost } from "~/services/blog.server";
import { PageContainer } from "~/components/PageContainer";

type LoaderData = {
  post: Awaited<ReturnType<typeof getPost>>;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  invariant(params.slug, "Expected params.slug");
  return json<LoaderData>({
    post: await getPost(params.slug),
  });
};

// https://remix.run/guides/routing#index-routes
export default function Blog() {
  const { post } = useLoaderData();
  return (
    <div className="remix__page overflow-hidden">
      <main className="">
        <Header heroImage={heroImage}>
          <div
            className="flex flex-col items-center px-4 py-8 text-center shadow-md md:items-start md:text-left"
            style={{ backgroundColor: overlayBackgroundColor }}
          >
            <h1 className="title-font mb-4 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
              {post.title}
            </h1>
          </div>
        </Header>
      </main>

      <PageContainer>
        <Outlet />
      </PageContainer>
    </div>
  );
}
