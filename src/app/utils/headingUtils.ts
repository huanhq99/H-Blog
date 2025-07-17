// utils/headingUtils.ts
export const generateHeadingId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')                       // 空格换成 -
    .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, '')    // 去除非中英文/数字/连字符
    .replace(/^-+|-+$/g, '')                   // 去掉头尾 -
};

export const extractTextFromNode = (node: any): string => {
  if (node?.text) return node.text;
  if (node?.children) {
    return node.children.map((child: any) => extractTextFromNode(child)).join('');
  }
  return '';
};