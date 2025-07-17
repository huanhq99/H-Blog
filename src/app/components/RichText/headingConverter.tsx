import { JSXConverters } from '@payloadcms/richtext-lexical/react'
import { SerializedHeadingNode } from '@payloadcms/richtext-lexical'


export const headingConverter: JSXConverters<SerializedHeadingNode> = {
  heading: ({ node, nodesToJSX }) => {
    const textArray = nodesToJSX({ nodes: node.children });
    const plainText = textArray.join(" ").trim();

    if (node.tag === 'h2') {
      const id = plainText
        .toLowerCase()
        .replace(/\s+/g, '-')           // 空格转为 -
        .replace(/[^\p{L}\p{N}-]+/gu, ''); // 移除非字母数字（含 Unicode 字符）和 -

      return <h2 id={id}>{textArray}</h2>;
    } else {
      const Tag = node.tag;
      return <Tag>{plainText}</Tag>;
    }
  }
};
