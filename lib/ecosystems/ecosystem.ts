export type Change = string; //TODO

export type Article = {
    name: string;
    changelog: Change[];
}

export interface Ecosystem {
    /* Fetches an article given it's name, or null if the article doesn't
     * exist.
    */
    fetchArticle(name: string): Promise<Article | null>;

    /*
     * Adds empty article to repository, returns true if it was successful, false
     * otherwise. An article name must be unique.
    */
    addArticle(name: string): Promise<boolean>;

    /*
     * Edits an article in a git style, where only the changes are passed to 
     * the method.
    */
    editArticle(name: string, changes: Change[]): Promise<boolean>;

    /*
     * Returns all the changes done to an article.
    */
    viewHistory(name: string): string[][];
}
