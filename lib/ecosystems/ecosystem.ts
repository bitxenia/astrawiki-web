import { Article } from "../articles/article";
import { Version } from "../articles/version";

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
   * If no version is given, an empty article will be created.
   */
  createArticle(name: string, version?: Version): Promise<void>;

  /**
   * Edits an article by passing the new version as an argument.
   * @param name Name of the article to edit
   * @param version Version to add to article
   */
  editArticle(name: string, version: Version): Promise<void>;

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

export { Article };
