import { json, TypedResponse } from "@remix-run/node";
import { BlogPostMeta, Post } from "~/utils/types";

import * as BlogPostReactNativeBoringAvatars from "../posts/forking-react-native-boring-avatars.mdx";
import * as BlogPostClosedAlphaBegins from "../posts/closed-alpha-begins.mdx";
import * as BlogPostOpenBetaCommences from "../posts/open-beta-commences.mdx";
import dayjs from "dayjs";

function getSlugFromFilename(filename: string) {
  return filename.replace(/\.mdx?$/, "");
}

function postFromModule(mod: BlogPostMeta): Post {
  return {
    ...(mod.attributes.meta as Post),
    slug: getSlugFromFilename(mod.filename),
  };
}

function getRawPosts(): BlogPostMeta[] {
  return [
    BlogPostReactNativeBoringAvatars,
    BlogPostClosedAlphaBegins,
    BlogPostOpenBetaCommences,
  ];
}

function getPostsMeta(): Array<Post> {
  return getRawPosts()
    .map(postFromModule)
    .sort(
      (postA, postB) =>
        dayjs(postA.publishDate).unix() - dayjs(postB.publishDate).unix()
    );
}

function getFilteredPosts() {
  return getPostsMeta().filter((postA) => !postA.draft);
}

export async function getPosts(): Promise<TypedResponse<Array<Post>>> {
  return json(
    getPostsMeta()
    // getFilteredPosts()
  );
}

export async function getPost(
  slug: string
): Promise<TypedResponse<BlogPostMeta>> {
  const posts = getRawPosts();

  const post = posts.find((_post) => {
    return getSlugFromFilename(_post.filename) === slug;
  });

  if (post) {
    return json(post);
  } else {
    throw new Response("Not Found", { status: 404 });
  }
}
