import { patch_obj } from "diff-match-patch";

export type Patch = {
  date: string;
  patch: (new () => patch_obj)[];
  parentId: string | null; // Date string
};

export type Article = {
  name: string;
  patches: Patch[];
};

export type OptIn = {
  createWithContent: boolean;
  optimizedSearch: boolean;
};

export interface Ecosystem {
  // NOTE: This could be better handled but would mean breaking the current
  // implementations of the ecosystems
  optIn?: OptIn;
  /*
   * Init function, meant to be ran after creating an instance. Useful for
   * async dependencies.
   */
  init(): Promise<void>;

  /* Fetches an article given it's name.
   */
  fetchArticle(name: string): Promise<Article>;

  /*
   * Creates an article to repository. An article name must be unique.
   * If no patch is given, an empty article will be created.
   */
  createArticle(name: string, patch?: Patch): Promise<null>;

  /**
   * Edits an article by passing the delta/diff/patch as an argument.
   * @param name Name of the article to edit
   * @param patch Patch to add to article
   */
  editArticle(name: string, patch: Patch): Promise<null>;

  // TODO: Deprecate this function and leave searching functionality to the
  // ecosystem
  getArticleList(): Promise<string[]>;

  /**
   * Searches the ecosystem's data for articles whose titles match the query,
   * and returns them in a paginated way.
   * @param query The text to be matched against
   * @param limit The amount of articles to return
   * @param offset The starting article to pick up from
   * @returns An array of article titles
   */
  searchArticles(
    query: string,
    limit: number,
    offset: number,
  ): Promise<string[]>;
}
