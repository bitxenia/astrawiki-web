import { Patch } from "./ecosystems/ecosystem";
import DiffMatchPatch from 'diff-match-patch';

export function getTextFromPatches(patches: Patch[]): string {
    const dmp = new DiffMatchPatch();
    const patch_objs = patches.map(patch => patch.patch).flat();
    const [ret, results] = dmp.patch_apply(patch_objs, "");
    for (let i = 0; i < results.length; i++) {
        if (!results[i]) {
            throw new Error(`Failed to apply patch ${i}`);
        }
    }
    return ret;
}

export function getPatchFromTwoTexts(oldText: string, newText: string): Patch {
    const dmp = new DiffMatchPatch();
    const patch_objs = dmp.patch_make(oldText, newText);
    const date = new Date();
    return {
        date: date.toISOString(),
        patch: patch_objs
    }
}
