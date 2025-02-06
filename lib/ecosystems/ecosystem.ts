import { patch_obj } from "diff-match-patch";

export type Patch = {
  date: string;
  patch: (new () => patch_obj)[];
};

export type Article = {
  name: string;
  patches: Patch[];
};

export interface Ecosystem {
  // TODO: Make this property mandatory once implemented in all current
  // ecosystems.
  optIn?: {
    createWithContent: boolean;
  };
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

  /*
   * Edits an article by passing the delta/diff/patch as an argument.
   */
  editArticle(name: string, patch: Patch): Promise<null>;

  getArticleList(): Promise<string[]>;
}
