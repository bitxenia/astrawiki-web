import { Version } from "@/lib/articles/version";
import { ArticleCache } from "../../../lib/articles/cache";
import { MockEcosystem } from "./mocks/mock-ecosystem";

const mockVersion: Version = {
  id: "1",
  date: Date.now().toString(),
  patch: [],
  parent: null,
};

describe("article cache", () => {
  it("cache fetches article if not present", async () => {
    const cache = new ArticleCache();
    const mockEcosystem = new MockEcosystem();
    await mockEcosystem.createArticle("an article", mockVersion);
    mockEcosystem.ecosystemCalls = 0;
    await cache.get("an article", mockEcosystem);
    expect(mockEcosystem.ecosystemCalls).toBe(1);
  });

  it("cache returns article already present", async () => {
    const cache = new ArticleCache();
    const mockEcosystem = new MockEcosystem();
    const articleName = "Article2";
    await mockEcosystem.createArticle(articleName, mockVersion);
    mockEcosystem.ecosystemCalls = 0;
    await cache.get(articleName, mockEcosystem);
    await cache.get(articleName, mockEcosystem);
    expect(mockEcosystem.ecosystemCalls).toBe(1);
  });

  it("cache fetches article after invalidating", async () => {
    const cache = new ArticleCache();
    const mockEcosystem = new MockEcosystem();
    const articleName = "Article3";
    await mockEcosystem.createArticle(articleName, mockVersion);
    mockEcosystem.ecosystemCalls = 0;
    await cache.get(articleName, mockEcosystem);
    cache.invalidate(articleName);
    await cache.get(articleName, mockEcosystem);
    expect(mockEcosystem.ecosystemCalls).toBe(2);
  });

  it("cache fetches different article", async () => {
    const cache = new ArticleCache();
    const mockEcosystem = new MockEcosystem();
    const articleName1 = "Article 4.1";
    const articleName2 = "Article 4.2";
    await mockEcosystem.createArticle(articleName1, mockVersion);
    await mockEcosystem.createArticle(articleName2, mockVersion);
    mockEcosystem.ecosystemCalls = 0;
    await cache.get(articleName1, mockEcosystem);
    await cache.get(articleName2, mockEcosystem);
    expect(mockEcosystem.ecosystemCalls).toBe(2);
  });

  it("invalidate all articles", async () => {
    const cache = new ArticleCache();
    const mockEcosystem = new MockEcosystem();
    const articleName1 = "Article 5.1";
    const articleName2 = "Article 5.2";
    await mockEcosystem.createArticle(articleName1, mockVersion);
    await mockEcosystem.createArticle(articleName2, mockVersion);
    mockEcosystem.ecosystemCalls = 0;
    await cache.get(articleName1, mockEcosystem);
    await cache.get(articleName2, mockEcosystem);
    expect(mockEcosystem.ecosystemCalls).toBe(2);
    mockEcosystem.ecosystemCalls = 0;
    cache.invalidate();
    await cache.get(articleName1, mockEcosystem);
    await cache.get(articleName2, mockEcosystem);
    expect(mockEcosystem.ecosystemCalls).toBe(2);
  });
});
