import { json, TypedResponse } from "@remix-run/node";
import { BlogPostMeta, Post } from "~/utils/types";

import * as BlogPostReactNativeBoringAvatars from "../posts/forking-react-native-boring-avatars.mdx";
import * as BlogPostClosedAlphaBegins from "../posts/closed-alpha-begins.mdx";
import * as BlogPostOpenBetaCommences from "../posts/open-beta-commences.mdx";
import dayjs from "dayjs";

function postFromModule(mod: BlogPostMeta): Post {
  return {
    ...(mod.attributes.meta as Post),
    slug: mod.filename.replace(/\.mdx?$/, ""),
  };
}

function getRawPosts(): Array<Post> {
  return [
    postFromModule(BlogPostReactNativeBoringAvatars),
    postFromModule(BlogPostClosedAlphaBegins),
    postFromModule(BlogPostOpenBetaCommences),
  ].sort(
    (postA, postB) =>
      dayjs(postA.publishDate).unix() - dayjs(postB.publishDate).unix()
  );
}

function getFilteredPosts() {
  return getRawPosts().filter((postA) => !postA.draft);
}

export async function getPosts(): Promise<TypedResponse<Array<Post>>> {
  return json(
    getRawPosts()
    // getFilteredPosts()
  );
}

export async function getPost(slug: string): Promise<Post> {
  const posts: Post[] = await (await getPosts()).json();

  const post = posts.find((_post) => _post.slug === slug);

  if (post) {
    return post;
  } else {
    throw new Response("Not Found", { status: 404 });
  }
}
