import { Patch } from "./ecosystem";

export class Article {
  private name: string;
  private patches: Map<string, Patch>;
  private lastPatch: string | null;
  private cachedMainBranch: Patch[] | null;
  constructor(name: string, patches: Patch[]) {
    this.name = name;
    this.patches = new Map();
    for (const patch of patches) {
      this.patches.set(patch.date, patch);
    }
    this.lastPatch = this.patches.size > 0 ? this.getLastPatch() : null;
    this.cachedMainBranch = null;
    console.log("Last patches: ", this.lastPatch);
    console.log("Patches1: ", this.patches);
  }

  private getLastPatch(): string {
    const leavesIds = this.getLeaves(this.patches);
    const longestLeaves = this.getLongestBranchLeaf(
      leavesIds,
      this.patches,
    ).map((leafId) => this.patches.get(leafId)!);
    longestLeaves.sort((a, b) => (a.date < b.date ? 1 : -1));
    return longestLeaves.pop()!.date;
  }

  private getLeaves(patches: Map<string, Patch>): Set<string> {
    const leaves: Set<string> = new Set();
    const seen: Set<string> = new Set();
    for (const [id, patch] of patches) {
      if (seen.has(id)) continue;
      if (patch.parentId) {
        seen.add(patch.parentId);
        leaves.delete(patch.parentId);
      }
      leaves.add(id);
    }
    return leaves;
  }

  private getLongestBranchLeaf(
    leavesIds: Set<string>,
    patches: Map<string, Patch>,
  ): string[] {
    const rootDistanceByPatch: Map<string, number> = new Map();
    let maxDistance = 0;
    const leafDistances: { leafId: string; distance: number }[] = [];

    for (const leafId of leavesIds) {
      const distance = this.getPatchRootDistance(
        leafId,
        rootDistanceByPatch,
        patches,
      );
      leafDistances.push({ leafId, distance });
      if (distance > maxDistance) {
        maxDistance = distance;
      }
    }
    return leafDistances
      .filter((ld) => ld.distance === maxDistance)
      .map((ld) => ld.leafId);
  }

  private getPatchRootDistance(
    patchId: string,
    rootDistanceByPatch: Map<string, number>,
    patches: Map<string, Patch>,
  ): number {
    if (rootDistanceByPatch.has(patchId)) {
      return rootDistanceByPatch.get(patchId)!;
    }
    const patch = patches.get(patchId);
    if (!patch) throw Error(`Patch not found: ${patchId}`);
    if (!patch.parentId) {
      rootDistanceByPatch.set(patchId, 0);
      return 0;
    }
    const distance =
      this.getPatchRootDistance(patch.parentId, rootDistanceByPatch, patches) +
      1;
    rootDistanceByPatch.set(patchId, distance);
    return distance;
  }

  getName(): string {
    return this.name;
  }

  getParentPatchId(): string | null {
    return this.lastPatch;
  }

  getPatches(): Patch[] {
    return Array.from(this.patches.values());
  }

  /**
   * Get complete main branch, down to the root. The main branch is defined by
   * the length of the branch, and the age (in that order of priority).
   * @returns Array of patches, from root to the latest "main" patch.
   */
  getMainPatchBranch(): Patch[] {
    if (this.cachedMainBranch) return this.cachedMainBranch;
    let leafId: string | null = this.lastPatch;
    if (!leafId) return [];
    const ret = this.getPatchBranch(leafId);
    this.cachedMainBranch = ret;
    return ret;
  }

  /**
   * Get complete branch starting from a given patch, down to the root.
   * @param patchId Patch to start the branch from.
   * @returns Array of patches, from root to the given patch.
   */
  getPatchBranch(patchId: string): Patch[] {
    const ret = [];
    let currentPatchId: string | null = patchId;
    while (currentPatchId) {
      const patch = this.patches.get(currentPatchId);
      if (!patch)
        throw Error("Patch not found while walking main patch branch");
      ret.push(patch);
      currentPatchId = patch.parentId;
    }
    ret.reverse();
    return ret;
  }
}
