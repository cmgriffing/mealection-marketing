/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  // watchPaths: ["../../packages/remark-remix-image"],
  browserBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "api/build",
  mdx: async (filename) => {
    const [
      rehypeHighlight,
      remarkToc,
      rehypeRaw,
      remarkRemixImage,
      remarkMdxFrontmatter,
    ] = await Promise.all([
      import("rehype-highlight").then((mod) => mod.default),
      import("remark-toc").then((mod) => mod.default),
      import("rehype-raw").then((mod) => mod.default),
      import("remark-remix-image").then((mod) => mod.default),
      import("remark-mdx-frontmatter").then((mod) => mod.default),
    ]);

    return {
      remarkPlugins: [
        // remarkMdxFrontmatter(),
        remarkToc,
        // remarkRemixImage,
      ],
      rehypePlugins: [
        rehypeHighlight,
        //   rehypeRaw,
      ],
    };
  },
};
