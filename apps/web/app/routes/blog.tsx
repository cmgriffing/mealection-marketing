import {
  Outlet,
  useLoaderData,
  useParams,
  json,
  Link,
  LoaderFunction,
} from "remix";
import { overlayBackgroundColor } from "~/config/colors";
import { Header } from "~/components/Header";

import heroImage from "~/images/hero.jpg";

import { getPosts, getPost } from "~/services/blog.server";
import { PageContainer } from "~/components/PageContainer";
import { BlogPostMeta, Post } from "~/utils/types";
import { Card } from "~/components/Card";

type LoaderData = {
  // this is a handy way to say: "posts is whatever type getPosts resolves to"
  posts?: Post[];
  post?: BlogPostMeta;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const slugParts = request.url.split("/");
  const slug = slugParts[slugParts.length - 1];

  if (!slug || slug === "blog") {
    return json<LoaderData>({
      posts: await (await getPosts()).json(),
    });
  } else {
    return json<LoaderData>({
      post: await (await getPost(slug)).json(),
    });
  }
};

// https://remix.run/guides/routing#index-routes
export default function Blog() {
  const { post } = useLoaderData<LoaderData>();

  return (
    <div className="remix__page overflow-hidden">
      <main className="">
        <Header
          heroImage={post?.attributes?.meta?.backgroundImage || heroImage}
        >
          <PageContainer>
            <Card>
              <h1 className="title-font text-center text-3xl font-bold text-gray-900 sm:text-4xl">
                {post?.attributes?.meta?.title || "Blog"}
              </h1>
            </Card>
          </PageContainer>
        </Header>
      </main>

      <PageContainer>
        <div className="flex flex-row">
          <div className="w-full md:pr-4">
            <Outlet />
          </div>
          <div className="w-[300px] md:pl-4">
            <Card>
              <h3 className="mb-2 text-xl font-bold">
                Want to help test Mealection?
              </h3>
              <p>
                Head to the{" "}
                <Link
                  className="decoration-primary-500 underline decoration-2"
                  to="/"
                >
                  home page
                </Link>{" "}
                and register now.
              </p>
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
