import axios, { HttpStatusCode } from "axios";
import { Ecosystem, OptIn } from "./ecosystem";
import dotenv from "dotenv";
import { Article } from "../articles/article";
import { Version } from "../articles/version";

dotenv.config();

const PORT = process.env.PORT ? process.env.PORT : 3001;
const URL =
  process.env.ENV === "prod"
    ? process.env.EXAMPLE_SERVER_URL
    : `http://localhost:${PORT}`;

type ArticleResponse = {
  versions: string;
};

export default class ExampleServer implements Ecosystem {
  optIn?: OptIn = {
    createWithContent: true,
    optimizedSearch: true,
  };

  async init() {
    console.log("Initializing");
  }

  async fetchArticle(name: string): Promise<Article> {
    if (name.length === 0) {
      throw Error("No name given");
    }

    const { data, status } = await axios.get<ArticleResponse>(
      `${URL}/articles/${name}`,
    );
    if (status === HttpStatusCode.NotFound) {
      throw Error("Article not found in ecosystem");
    } else if (status !== HttpStatusCode.Ok) {
      throw Error("Server error");
    }
    return new Article(name, JSON.parse(data.versions));
  }

  async createArticle(name: string, version?: Version): Promise<void> {
    if (name.length === 0) {
      throw Error("Name cannot be empty");
    }

    console.log(`Name: ${name}`);
    const { status } = version
      ? await axios.post(`${URL}/articles/`, { name, version })
      : await axios.post(`${URL}/articles/`, { name });
    if (status === HttpStatusCode.Conflict) {
      throw Error("Article already exists");
    }

    console.log("Article posted succesfully");
  }

  async editArticle(name: string, version: Version): Promise<void> {
    if (name.length === 0) {
      throw Error("No name given");
    }
    const { status } = await axios.patch(`${URL}/articles/${name}`, version);
    if (status === HttpStatusCode.BadRequest) {
      throw Error("Bad request while editing article");
    } else if (status === HttpStatusCode.NotFound) {
      throw Error("Article to edit not found");
    }
  }

  async getArticleList(): Promise<string[]> {
    const { data } = await axios.get<string[]>(`${URL}/articles`);
    return data;
  }

  async searchArticles(
    query: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<string[]> {
    const { data } = await axios.get<string[]>(`${URL}/articles`, {
      params: {
        query,
        limit,
        offset,
      },
    });
    return data;
  }
}
