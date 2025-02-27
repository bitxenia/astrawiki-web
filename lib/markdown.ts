import { Ecosystem } from "./ecosystems/ecosystem";
import { getTextFromPatches } from "./diff";
import { MemoizedArticles } from "./memoizedarticles";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { Article } from "./ecosystems/article";

/**
 * Initializes the cache
 */
const cache = new MemoizedArticles();

/**
 * Fetches article from the given ecosystem and builds from patches.
 * @param articleName Name of the article, case sensitive.
 * @param ecosystem Ecosystem to fetch the article from.
 * @param articleVersion Version to build article from. Latest if null.
 * @returns article as raw markdown (without frontmatter).
 */
export async function getArticle(
  articleName: string,
  ecosystem: Ecosystem,
  version?: string,
): Promise<string> {
  const article = await cache.get(articleName, ecosystem);
  let patches;
  if (version === undefined) patches = article.getMainPatchBranch();
  else patches = article.getPatchBranch(version);
  console.log("Patches retrieved: ", patches);
  return getTextFromPatches(patches);
}

/**
 * Gets article patches from the given ecosystem.
 * @param articleName Name of the article, case sensitive.
 * @param ecosystem Ecosystem to get the article patches from.
 * @returns Array of patches from the article.
 */
export async function getAllPatches(articleName: string, ecosystem: Ecosystem) {
  const article = await cache.get(articleName, ecosystem);

  return article.getPatches();
}

export async function getParentPatch(
  articleName: string,
  ecosystem: Ecosystem,
) {
  const article = await cache.get(articleName, ecosystem);
  return article.getParentPatchId();
}

/**
 * Deletes the current cache for the given article, forcing a re-fetch of any
 * article in it. If no article name is given, invalidates the whole cache.
 * @param articleName Delet
 */
export async function invalidateCache(articleName?: string) {
  cache.invalidate(articleName);
}

export type TocItem = { href: string; level: number; text: string };

export async function getTableOfContents(
  rawArticle: string,
): Promise<TocItem[]> {
  const tree = unified().use(remarkParse).parse(rawArticle);
  const tocs: TocItem[] = [];

  visit(tree, "heading", (node: any) => {
    const text = node.children.map((child: any) => child.value).join("");
    const href = `#${text.toLowerCase().replace(/\s+/g, "-")}`;

    tocs.push({ href, level: node.depth, text });
  });
  console.log(tocs);
  return tocs;
}
