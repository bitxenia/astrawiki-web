import { patch_obj } from "diff-match-patch";

export type Patch = {
    date: string;
    patch: (new () => patch_obj)[];
};

export type Article = {
    name: string;
    patches: Patch[];
}

export interface Ecosystem {
    /* Fetches an article given it's name.
    */
    fetchArticle(name: string): Promise<Article>;

    /*
     * Creates empty article to repository. An article name must be unique.
    */
    createArticle(name: string): Promise<null>;

    /*
     * Edits an article by passing the delta/diff/patch as an argument.
    */
    editArticle(name: string, patch: Patch): Promise<null>;

    getArticleList(): Promise<string[]>;
}
