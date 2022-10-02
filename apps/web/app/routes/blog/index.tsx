import { Link, useLoaderData } from "remix";
import { json } from "remix";
import { overlayBackgroundColor } from "~/config/colors";
import { Header } from "~/components/Header";

import heroImage from "~/images/hero.jpg";

import { getPosts } from "~/services/blog.server";
import { PageContainer } from "~/components/PageContainer";
import { Card } from "~/components/Card";

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
    <ul>
      {posts.map((post) => (
        <li>
          <Link to={`/blog/${post.slug}`}>
            <Card>
              <h2 className="mb-4 text-2xl font-bold">{post.title}</h2>
              <span>{post.publishDate}</span>
              <p>{post.description}</p>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
