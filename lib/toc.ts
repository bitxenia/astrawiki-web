import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export type TocItem = { href: string; level: number; text: string; id: number };

export async function getTableOfContents(
  rawArticle: string,
): Promise<TocItem[]> {
  const tree = unified().use(remarkParse).parse(rawArticle);
  const tocs: TocItem[] = [];
  let i = 0;

  visit(tree, "heading", (node: any) => {
    const text = node.children.map((child: any) => child.value).join("");
    const href = `#${text.toLowerCase().replace(/\s+/g, "-")}`;

    tocs.push({
      href,
      level: node.depth,
      text,
      id: i,
    });
    i++;
  });
  console.log(tocs);
  return tocs;
}
