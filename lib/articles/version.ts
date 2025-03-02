import DiffMatchPatch, { patch_obj } from "diff-match-patch";

export type VersionID = string;

export type Version = {
  id: VersionID;
  date: string;
  patch: (new () => patch_obj)[];
  parent: VersionID | null;
};

export function createVersion(
  oldText: string,
  newText: string,
  parent: VersionID | null,
): Version {
  const id = crypto.randomUUID();
  const date = Date.now().toString();
  const dmp = new DiffMatchPatch();
  const patch = dmp.patch_make(oldText, newText);
  return {
    id,
    date,
    patch,
    parent,
  };
}

export function compileTextFromVersions(versions: Version[]): string {
  const dmp = new DiffMatchPatch();
  const patches = versions.flatMap((version) => version.patch);
  const [ret, results] = dmp.patch_apply(patches, "");
  for (let i = 0; i < results.length; i++) {
    if (!results[i]) {
      throw new Error(`Failed to apply patch ${i}`);
    }
  }
  return ret;
}
