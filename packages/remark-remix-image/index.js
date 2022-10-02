// import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";

export default () => {
  return (tree, file) => {
    const nodeTypes = new Set();

    let children = tree?.children;
    let newChildren = [];
    while (children?.length) {
      children.forEach((node) => {
        if (!node) {
          return;
        }

        if (node?.children?.length) {
          newChildren.push(...node.children);
        }

        nodeTypes.add(node.type);

        if (node.type === "mdxJsxFlowElement") {
          console.log(JSON.stringify(node, null, 2));
        }

        if (node.type === "heading") {
          let { depth } = node;

          // Skip if not an h1
          if (depth !== 2) return;

          // Grab the innerText of the heading node
          let text = toString(node);

          const html = `
      <h1 style="color: rebeccapurple">
        ${text}
      </h1>
    `;

          // node.type = "mdxjsEsm";
          // node.children = undefined;
          // node.value = html;
        }
      });

      children = newChildren;
      newChildren = [];
    }

    console.log({ nodeTypes });

    // console.log(JSON.stringify(tree, null, 2));

    return tree;
  };
};
