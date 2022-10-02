const { remarkMdxFrontmatter } = require("remark-mdx-frontmatter");

/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  browserBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "api/build",
  mdx: async (filename) => {
    const [rehypeHighlight, remarkToc, rehypeRaw, remarkRemixImage] =
      await Promise.all([
        import("rehype-highlight").then((mod) => mod.default),
        import("remark-toc").then((mod) => mod.default),
        import("rehype-raw").then((mod) => mod.default),
        import("remark-remix-image").then((mod) => mod.default),
      ]);

    return {
      remarkPlugins: [remarkToc, remarkRemixImage],
      rehypePlugins: [
        // rehypeRaw,
        rehypeHighlight,
      ],
    };
  },
};
