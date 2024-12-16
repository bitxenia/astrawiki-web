import axios, { HttpStatusCode } from "axios";
import { Article, Patch, Ecosystem } from "./ecosystem";

const URL = "localhost:3001"

type ArticleResponse = {
    patches: Patch[]
}

export default class ExampleServer implements Ecosystem {
    async fetchArticle(name: string): Promise<Article> {
        if (name.length === 0) {
            return Promise.reject("Name cannot be empty");
        }

        const { data, status } = await axios.get<ArticleResponse>(`${URL}/articles/${name}`);
        if (status === HttpStatusCode.NotFound) {
            return Promise.reject("Article not found");
        } else if (status !== HttpStatusCode.Ok) {
            return Promise.reject("Server error");
        }
        const newArticle: Article = {
            name,
            patches: data.patches,
        }
        return Promise.resolve(newArticle);
    }

    async createArticle(name: string): Promise<null> {
        if (name.length === 0) {
            return Promise.reject("Name cannot be empty");
        }

        const { status } = await axios.post(`${URL}/articles/`, { name });
        if (status === HttpStatusCode.Conflict) {
            return Promise.reject("Article already exists");
        }

        return Promise.resolve(null);
    }

    async editArticle(name: string, patch: Patch): Promise<null> {
        if (name.length === 0) {
            return Promise.reject("Name cannot be empty");
        }
        const { status } = await axios.patch(`${URL}/articles/${name}`, patch);
        if (status === HttpStatusCode.BadRequest) {
            return Promise.reject("Bad request");
        } else if (status === HttpStatusCode.NotFound) {
            return Promise.reject("Article not found");
        }
        return Promise.resolve(null);
    }
}
