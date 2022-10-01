import { useLoaderData } from "remix";
import { json } from "remix";
import { overlayBackgroundColor } from "~/config/colors";
import { Header } from "~/components/Header";

import heroImage from "~/images/hero.jpg";

import { getPosts } from "~/services/blog.server";
import { PageContainer } from "~/components/PageContainer";
import { Post } from "~/utils/types";

type LoaderData = {
  // this is a handy way to say: "posts is whatever type getPosts resolves to"
  posts: Post[];
};

export const loader = async () => {
  return json<LoaderData>({
    posts: await (await getPosts()).json(),
  });
};

// https://remix.run/guides/routing#index-routes
export default function Blog() {
  const { posts } = useLoaderData<LoaderData>();

  return (
    <div className="remix__page overflow-hidden">
      <main className="">
        <Header heroImage={heroImage}>
          <div
            className="flex flex-col items-center px-4 py-8 text-center shadow-md md:items-start md:text-left"
            style={{ backgroundColor: overlayBackgroundColor }}
          >
            <h1 className="title-font mb-4 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
              Blog
            </h1>
          </div>
        </Header>
      </main>

      <PageContainer>
        <div className="flex flex-row">
          <div className="w-full">
            <ul className="px-8">
              {posts.map((post) => (
                <li
                  className="mb-8 flex flex-col items-center px-4 py-8 text-center shadow-md md:items-start md:text-left"
                  style={{ backgroundColor: overlayBackgroundColor }}
                >
                  <h2 className="mb-4 text-2xl font-bold">{post.title}</h2>
                  <span>{post.publishDate}</span>
                  <p>{post.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-[300px]">
            <div
              className="mb-8 flex flex-col items-center px-4 py-8 text-center shadow-md md:items-start md:text-left"
              style={{ backgroundColor: overlayBackgroundColor }}
            >
              <h3>sidebar</h3>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
