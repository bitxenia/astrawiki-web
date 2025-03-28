import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export type TocItem = { href: string; level: number; text: string; id: number };

// Start the counter on 0 and when the href is repeated begin with 1.
// It seems that Markdown (or the library we are using) automatically handles
// repeated headers appending '-1', '-2', and so on, to the href of the header.
const BASE_HREF_COUNT: number = 0;

export async function getTableOfContents(
  rawArticle: string,
): Promise<TocItem[]> {
  const tree = unified().use(remarkParse).parse(rawArticle);
  const tocs: TocItem[] = [];
  let i = 0;
  const hrefs: Map<string, number> = new Map();

  visit(tree, "heading", (node: any) => {
    const text = node.children.map((child: any) => child.value).join("");
    const href_text = `#${text.toLowerCase().replace(/\s+/g, "-")}`;
    const href_count = hrefs.has(href_text)
      ? hrefs.get(href_text)! + 1
      : BASE_HREF_COUNT;

    hrefs.set(href_text, href_count);

    const href =
      href_count == BASE_HREF_COUNT ? href_text : `${href_text}-${href_count}`;

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
