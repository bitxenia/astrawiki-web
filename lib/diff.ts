import { Patch } from "./ecosystems/ecosystem";
import DiffMatchPatch from "diff-match-patch";

/**
 * @param patches Array of patches to apply to get the final result, from
 * oldest to newest
 */
export function getTextFromPatches(patches: Patch[]): string {
  const dmp = new DiffMatchPatch();
  const patch_objs = patches.flatMap((patch) => patch.patch);
  const [ret, results] = dmp.patch_apply(patch_objs, "");
  for (let i = 0; i < results.length; i++) {
    if (!results[i]) {
      throw new Error(`Failed to apply patch ${i}`);
    }
  }
  return ret;
}

/**
 * @param oldText text of the article up until the parent patch
 * @param newText new version of the article's text
 * @param parentId id of the patch the new patch is built on top of
 */
export function getPatchFromTwoTexts(
  oldText: string,
  newText: string,
  parentId: string | null,
): Patch {
  const dmp = new DiffMatchPatch();
  const patch_objs = dmp.patch_make(oldText, newText);
  const date = new Date();
  return {
    date: date.toISOString(),
    patch: patch_objs,
    parentId,
  };
}
