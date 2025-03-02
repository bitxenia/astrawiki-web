import { VersionID, Version } from "./version";

export class Article {
  private name: string;
  private versions: Map<string, Version>;
  private lastVersion: VersionID | null;
  private cachedMainBranch: Version[] | null;
  constructor(name: string, patches: Version[]) {
    this.name = name;
    this.versions = new Map();
    for (const patch of patches) {
      this.versions.set(patch.id, patch);
    }
    this.lastVersion = this.versions.size > 0 ? this.getLastPatch() : null;
    this.cachedMainBranch = null;
    console.log("Last patches: ", this.lastVersion);
    console.log("Patches1: ", this.versions);
  }

  private getLastPatch(): string {
    const leavesIds = this.getLeaves(this.versions);
    const longestLeaves = this.getLongestBranchLeaf(
      leavesIds,
      this.versions,
    ).map((leafId) => this.versions.get(leafId)!);
    longestLeaves.sort((a, b) => (a.date < b.date ? 1 : -1));
    return longestLeaves.pop()!.id;
  }

  private getLeaves(versions: Map<VersionID, Version>): Set<VersionID> {
    const leaves: Set<VersionID> = new Set();
    const seen: Set<VersionID> = new Set();
    for (const [id, version] of versions) {
      if (seen.has(id)) continue;
      if (version.parent) {
        seen.add(version.parent);
        leaves.delete(version.parent);
      }
      leaves.add(id);
    }
    return leaves;
  }

  private getLongestBranchLeaf(
    leaves: Set<VersionID>,
    versions: Map<VersionID, Version>,
  ): VersionID[] {
    const rootDistanceByPatch: Map<VersionID, number> = new Map();
    let maxDistance = 0;
    const leafDistances: { leaf: VersionID; distance: number }[] = [];

    for (const leaf of leaves) {
      const distance = this.getVersionRootDistance(
        leaf,
        rootDistanceByPatch,
        versions,
      );
      leafDistances.push({ leaf, distance });
      if (distance > maxDistance) {
        maxDistance = distance;
      }
    }
    return leafDistances
      .filter((ld) => ld.distance === maxDistance)
      .map((ld) => ld.leaf);
  }

  private getVersionRootDistance(
    versionId: VersionID,
    rootDistanceByVersion: Map<VersionID, number>,
    allVersions: Map<VersionID, Version>,
  ): number {
    if (rootDistanceByVersion.has(versionId)) {
      return rootDistanceByVersion.get(versionId)!;
    }
    const version = allVersions.get(versionId);
    if (!version) throw Error(`Version not found: ${versionId}`);
    if (!version.parent) {
      rootDistanceByVersion.set(versionId, 0);
      return 0;
    }
    const distance =
      this.getVersionRootDistance(
        version.parent,
        rootDistanceByVersion,
        allVersions,
      ) + 1;
    rootDistanceByVersion.set(versionId, distance);
    return distance;
  }

  getName(): string {
    return this.name;
  }

  getLastVersion(): VersionID | null {
    return this.lastVersion;
  }

  getVersions(): Version[] {
    return Array.from(this.versions.values());
  }

  /**
   * Get complete main branch, down to the root. The main branch is defined by
   * the length of the branch, and the age of the latest version (in that order
   * of priority).
   * @returns Array of patches, from root to the latest "main" patch.
   */
  getMainBranch(): Version[] {
    if (this.cachedMainBranch) return this.cachedMainBranch;
    let leaf: VersionID | null = this.lastVersion;
    if (!leaf) return [];
    const ret = this.getBranch(leaf);
    this.cachedMainBranch = ret;
    return ret;
  }

  /**
   * Get complete branch starting from a given version, down to the root.
   * @param version Patch to start the branch from.
   * @returns Array of patches, from root to the given patch.
   */
  getBranch(version: VersionID): Version[] {
    const ret = [];
    let currentPatchId: string | null = version;
    while (currentPatchId) {
      const patch = this.versions.get(currentPatchId);
      if (!patch)
        throw Error("Version not found while walking main patch branch");
      ret.push(patch);
      currentPatchId = patch.parent;
    }
    ret.reverse();
    return ret;
  }
}
