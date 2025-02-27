import { Ecosystem } from "./ecosystems/ecosystem";
import { getPatchFromTwoTexts, getTextFromPatches } from "./diff";
import { ArticleCache } from "./cache";

/**
 * Initializes the cache
 */
const cache = new ArticleCache();

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

export async function createArticle(
  articleName: string,
  rawMarkdown: string,
  ecosystem: Ecosystem,
) {
  const patch = getPatchFromTwoTexts("", rawMarkdown, null);
  if (ecosystem.optIn?.createWithContent) {
    await ecosystem.createArticle(articleName, patch);
    console.log("Article created successfully!");
  } else {
    await ecosystem.createArticle(articleName);
    console.log("Empty article created successfully!");
    await ecosystem.editArticle(articleName, patch);
  }
}

/**
 * Builds patch and publishes update to the given ecosystem. Also invalidates
 * the cache for the given article to force fetch the article again.
 * @param articleName name of the article to edit
 * @param oldPlainText raw markdown of the old version
 * @param newPlainText raw markdown of the updated version
 * @param ecosystem ecosystem to edit the article on
 */
export async function editArticle(
  articleName: string,
  oldPlainText: string,
  newPlainText: string,
  ecosystem: Ecosystem,
) {
  const article = await cache.get(articleName, ecosystem);
  const parentId = article.getParentPatchId();
  const patch = getPatchFromTwoTexts(oldPlainText, newPlainText, parentId);
  ecosystem.editArticle(articleName, patch);
  cache.invalidate(articleName);
}

export async function invalidateCache(articleName?: string) {
  cache.invalidate(articleName);
}
