import { Patch } from "@/lib/ecosystems/ecosystem";
import { Article } from "../../../lib/ecosystems/article";

describe("Article", () => {
  it("get name", () => {
    const name = "test article";
    const article = new Article(name, []);
    expect(article.getName()).toBe(name);
  });

  it("retrieve zero patches", () => {
    const article = new Article("test", []);
    const ret = article.getPatches();
    expect(ret.length).toBe(0);
  });

  it("calculate zero patch main branch", () => {
    const article = new Article("test", []);
    const ret = article.getMainPatchBranch();
    expect(ret.length).toBe(0);
  });

  it("error on non existent patchId for side branch", () => {
    const article = new Article("test", []);
    const call = () => article.getPatchBranch("nonsense");
    expect(call).toThrow(Error);
  });

  it("retrieve one patch", () => {
    const patch: Patch = {
      date: Date.now().toString(),
      patch: [],
      parentId: null,
    };
    const article = new Article("test", [patch]);
    const ret = article.getPatches();
    expect(ret.length).toBe(1);
    expect(ret[0]).toEqual(patch);
  });

  it("calculate one patch main branch", () => {
    const patch: Patch = {
      date: Date.now().toString(),
      patch: [],
      parentId: null,
    };
    const article = new Article("test", [patch]);
    const ret = article.getMainPatchBranch();
    expect(ret.length).toBe(1);
    expect(ret[0]).toEqual(patch);
  });

  it("retrieve two patches", () => {
    const patch1: Patch = {
      date: Date.now().toString(),
      patch: [],
      parentId: null,
    };
    const patch2: Patch = {
      date: (Date.now() + 1000).toString(),
      patch: [],
      parentId: null,
    };
    const expected = [patch2, patch1];
    const article = new Article("test", expected);
    const ret = article.getPatches();
    expect(ret.length).toBe(2);
    expect(ret).toEqual(expected);
  });

  it("calculate two patch main branch", () => {
    const patch1Date = Date.now().toString();
    const patch1: Patch = {
      date: patch1Date,
      patch: [],
      parentId: null,
    };
    const patch2: Patch = {
      date: (Date.now() + 1234).toString(),
      patch: [],
      parentId: patch1Date,
    };
    const expected = [patch1, patch2];
    const article = new Article("test", expected);
    const ret = article.getMainPatchBranch();
    expect(ret.length).toBe(2);
    expect(ret).toEqual(expected);
  });

  it("calculate linear three patch main branch", () => {
    const patch1Date = Date.now().toString();
    const patch2Date = Date.now().toString() + 1234;
    const patch3Date = Date.now().toString() + 5678;
    const patch1: Patch = {
      date: patch1Date,
      patch: [],
      parentId: null,
    };
    const patch2: Patch = {
      date: patch2Date,
      patch: [],
      parentId: patch1Date,
    };
    const patch3: Patch = {
      date: patch3Date,
      patch: [],
      parentId: patch2Date,
    };
    const expected = [patch1, patch2, patch3];
    const article = new Article("test", [patch2, patch3, patch1]);
    const ret = article.getMainPatchBranch();
    expect(ret.length).toBe(3);
    expect(ret).toEqual(expected);
  });

  it("calculate forked three patch main branch", () => {
    const patch1Date = Date.now().toString();
    const patch2Date = Date.now().toString() + 1234;
    const patch3Date = Date.now().toString() + 5678;
    const patch1: Patch = {
      date: patch1Date,
      patch: [],
      parentId: null,
    };
    const patch2: Patch = {
      date: patch2Date,
      patch: [],
      parentId: patch1Date,
    };
    const patch3: Patch = {
      date: patch3Date,
      patch: [],
      parentId: patch1Date,
    };
    const expected = [patch1, patch2];
    const article = new Article("test", [patch2, patch3, patch1]);
    const ret = article.getMainPatchBranch();
    expect(ret.length).toBe(2);
    expect(ret).toEqual(expected);
  });

  it("calculate forked four patch main branch", () => {
    const patch1Date = Date.now().toString();
    const patch2Date = Date.now().toString() + 1234;
    const patch3Date = Date.now().toString() + 5678;
    const patch4Date = Date.now().toString() + 9012;
    const patch1: Patch = {
      date: patch1Date,
      patch: [],
      parentId: null,
    };
    const patch2: Patch = {
      date: patch2Date,
      patch: [],
      parentId: patch1Date,
    };
    const patch3: Patch = {
      date: patch3Date,
      patch: [],
      parentId: patch1Date,
    };
    const patch4: Patch = {
      date: patch4Date,
      patch: [],
      parentId: patch3Date,
    };
    const expected = [patch1, patch3, patch4];
    const article = new Article("test", [patch4, patch2, patch3, patch1]);
    const ret = article.getMainPatchBranch();
    expect(ret.length).toBe(3);
    expect(ret).toEqual(expected);
  });

  it("calculate patch branch twice", () => {
    const patch1Date = Date.now().toString();
    const patch2Date = Date.now().toString() + 1234;
    const patch3Date = Date.now().toString() + 5678;
    const patch4Date = Date.now().toString() + 9012;
    const patch1: Patch = {
      date: patch1Date,
      patch: [],
      parentId: null,
    };
    const patch2: Patch = {
      date: patch2Date,
      patch: [],
      parentId: patch1Date,
    };
    const patch3: Patch = {
      date: patch3Date,
      patch: [],
      parentId: patch1Date,
    };
    const patch4: Patch = {
      date: patch4Date,
      patch: [],
      parentId: patch3Date,
    };
    const article = new Article("test", [patch4, patch2, patch3, patch1]);
    const ret1 = article.getMainPatchBranch();
    const ret2 = article.getMainPatchBranch();
    expect(ret1).toEqual(ret2);
  });

  it("calculate forked four patch side branch from shortest stub", () => {
    const patch1Date = Date.now().toString();
    const patch2Date = Date.now().toString() + 1234;
    const patch3Date = Date.now().toString() + 5678;
    const patch4Date = Date.now().toString() + 9012;
    const patch1: Patch = {
      date: patch1Date,
      patch: [],
      parentId: null,
    };
    const patch2: Patch = {
      date: patch2Date,
      patch: [],
      parentId: patch1Date,
    };
    const patch3: Patch = {
      date: patch3Date,
      patch: [],
      parentId: patch1Date,
    };
    const patch4: Patch = {
      date: patch4Date,
      patch: [],
      parentId: patch3Date,
    };
    const expected = [patch1, patch2];
    const article = new Article("test", [patch4, patch2, patch3, patch1]);
    const ret = article.getPatchBranch(patch2Date);
    expect(ret.length).toBe(2);
    expect(ret).toEqual(expected);
  });

  it("calculate forked four patch side branch from root", () => {
    const patch1Date = Date.now().toString();
    const patch2Date = Date.now().toString() + 1234;
    const patch3Date = Date.now().toString() + 5678;
    const patch4Date = Date.now().toString() + 9012;
    const patch1: Patch = {
      date: patch1Date,
      patch: [],
      parentId: null,
    };
    const patch2: Patch = {
      date: patch2Date,
      patch: [],
      parentId: patch1Date,
    };
    const patch3: Patch = {
      date: patch3Date,
      patch: [],
      parentId: patch1Date,
    };
    const patch4: Patch = {
      date: patch4Date,
      patch: [],
      parentId: patch3Date,
    };
    const expected = [patch1];
    const article = new Article("test", [patch4, patch2, patch3, patch1]);
    const ret = article.getPatchBranch(patch1Date);
    expect(ret.length).toBe(1);
    expect(ret).toEqual(expected);
  });
});
