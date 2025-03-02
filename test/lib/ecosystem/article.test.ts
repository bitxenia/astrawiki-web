import { Version } from "@/lib/articles/version";
import { Article } from "../../../lib/articles/article";

describe("Article", () => {
  it("get name", () => {
    const name = "test article";
    const article = new Article(name, []);
    expect(article.getName()).toBe(name);
  });

  it("retrieve zero patches", () => {
    const article = new Article("test", []);
    const ret = article.getVersions();
    expect(ret.length).toBe(0);
  });

  it("calculate zero patch main branch", () => {
    const article = new Article("test", []);
    const ret = article.getMainBranch();
    expect(ret.length).toBe(0);
  });

  it("error on non existent patchId for side branch", () => {
    const article = new Article("test", []);
    const call = () => article.getBranch("nonsense");
    expect(call).toThrow(Error);
  });

  it("retrieve one patch", () => {
    const version: Version = {
      id: "1",
      date: Date.now().toString(),
      patch: [],
      parent: null,
    };
    const article = new Article("test", [version]);
    const ret = article.getVersions();
    expect(ret.length).toBe(1);
    expect(ret[0]).toEqual(version);
  });

  it("calculate one patch main branch", () => {
    const version: Version = {
      id: "1",
      date: Date.now().toString(),
      patch: [],
      parent: null,
    };
    const article = new Article("test", [version]);
    const ret = article.getMainBranch();
    expect(ret.length).toBe(1);
    expect(ret[0]).toEqual(version);
  });

  it("retrieve two patches", () => {
    const version1: Version = {
      id: "1",
      date: Date.now().toString(),
      patch: [],
      parent: null,
    };
    const version2: Version = {
      id: "2",
      date: (Date.now() + 1000).toString(),
      patch: [],
      parent: null,
    };
    const expected = [version2, version1];
    const article = new Article("test", expected);
    const ret = article.getVersions();
    expect(ret.length).toBe(2);
    expect(ret).toEqual(expected);
  });

  it("calculate two patch main branch", () => {
    const version1: Version = {
      id: "1",
      date: Date.now().toString(),
      patch: [],
      parent: null,
    };
    const version2: Version = {
      id: "2",
      date: (Date.now() + 1234).toString(),
      patch: [],
      parent: "1",
    };
    const expected = [version1, version2];
    const article = new Article("test", expected);
    const ret = article.getMainBranch();
    expect(ret.length).toBe(2);
    expect(ret).toEqual(expected);
  });

  it("calculate linear three patch main branch", () => {
    const version1: Version = {
      id: "1",
      date: Date.now().toString(),
      patch: [],
      parent: null,
    };
    const version2: Version = {
      id: "2",
      date: Date.now().toString() + 1234,
      patch: [],
      parent: "1",
    };
    const version3: Version = {
      id: "3",
      date: Date.now().toString() + 5678,
      patch: [],
      parent: "2",
    };
    const expected = [version1, version2, version3];
    const article = new Article("test", [version2, version3, version1]);
    const ret = article.getMainBranch();
    expect(ret.length).toBe(3);
    expect(ret).toEqual(expected);
  });

  it("calculate forked three patch main branch", () => {
    const version1: Version = {
      id: "1",
      date: Date.now().toString(),
      patch: [],
      parent: null,
    };
    const version2: Version = {
      id: "2",
      date: Date.now().toString() + 1234,
      patch: [],
      parent: "1",
    };
    const version3: Version = {
      id: "3",
      date: Date.now().toString() + 5678,
      patch: [],
      parent: "1",
    };
    const expected = [version1, version2];
    const article = new Article("test", [version2, version3, version1]);
    const ret = article.getMainBranch();
    expect(ret.length).toBe(2);
    expect(ret).toEqual(expected);
  });

  it("calculate forked four patch main branch", () => {
    const version1: Version = {
      id: "1",
      date: Date.now().toString(),
      patch: [],
      parent: null,
    };
    const version2: Version = {
      id: "2",
      date: Date.now().toString() + 1234,
      patch: [],
      parent: "1",
    };
    const version3: Version = {
      id: "3",
      date: Date.now().toString() + 5678,
      patch: [],
      parent: "1",
    };
    const version4: Version = {
      id: "4",
      date: Date.now().toString() + 9012,
      patch: [],
      parent: "3",
    };
    const expected = [version1, version3, version4];
    const article = new Article("test", [
      version4,
      version2,
      version3,
      version1,
    ]);
    const ret = article.getMainBranch();
    expect(ret.length).toBe(3);
    expect(ret).toEqual(expected);
  });

  it("calculate patch branch twice", () => {
    const version1: Version = {
      id: "1",
      date: Date.now().toString(),
      patch: [],
      parent: null,
    };
    const version2: Version = {
      id: "2",
      date: Date.now().toString() + 1234,
      patch: [],
      parent: "1",
    };
    const version3: Version = {
      id: "3",
      date: Date.now().toString() + 5678,
      patch: [],
      parent: "1",
    };
    const version4: Version = {
      id: "4",
      date: Date.now().toString() + 9012,
      patch: [],
      parent: "3",
    };
    const article = new Article("test", [
      version4,
      version2,
      version3,
      version1,
    ]);
    const ret1 = article.getMainBranch();
    const ret2 = article.getMainBranch();
    expect(ret1).toEqual(ret2);
  });

  it("calculate forked four patch side branch from shortest stub", () => {
    const version1: Version = {
      id: "1",
      date: Date.now().toString(),
      patch: [],
      parent: null,
    };
    const version2: Version = {
      id: "2",
      date: Date.now().toString() + 1234,
      patch: [],
      parent: "1",
    };
    const version3: Version = {
      id: "3",
      date: Date.now().toString() + 5678,
      patch: [],
      parent: "1",
    };
    const version4: Version = {
      id: "4",
      date: Date.now().toString() + 9012,
      patch: [],
      parent: "3",
    };
    const expected = [version1, version2];
    const article = new Article("test", [
      version4,
      version2,
      version3,
      version1,
    ]);
    const ret = article.getBranch("2");
    expect(ret.length).toBe(2);
    expect(ret).toEqual(expected);
  });

  it("calculate forked four patch side branch from root", () => {
    const version1: Version = {
      id: "1",
      date: Date.now().toString(),
      patch: [],
      parent: null,
    };
    const version2: Version = {
      id: "2",
      date: Date.now().toString() + 1234,
      patch: [],
      parent: "1",
    };
    const version3: Version = {
      id: "3",
      date: Date.now().toString() + 5678,
      patch: [],
      parent: "1",
    };
    const version4: Version = {
      id: "4",
      date: Date.now().toString() + 9012,
      patch: [],
      parent: "3",
    };
    const expected = [version1];
    const article = new Article("test", [
      version4,
      version2,
      version3,
      version1,
    ]);
    const ret = article.getBranch("1");
    expect(ret.length).toBe(1);
    expect(ret).toEqual(expected);
  });
});
