import { verifyReleasePackage } from "@/lib/v41_releaseVerifier";
import type { CreatorReleasePackage } from "@/lib/v40_releasePackage";

const KEY = "mera-word-search.release-archive.v1";
export type ArchivedRelease = {
  archiveId: string;
  importedAt: string;
  fileName: string;
  package: CreatorReleasePackage;
  verifiedAt: string;
};

function read(): ArchivedRelease[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}
function write(items: ArchivedRelease[]) { localStorage.setItem(KEY, JSON.stringify(items.slice(0, 100))); }

export async function archiveRelease(input: unknown, fileName = "release.json") {
  const check = await verifyReleasePackage(input);
  if (!check.verified) throw new Error(check.issues[0] ?? "Release package is not verified.");
  const pkg = input as CreatorReleasePackage;
  const items = read().filter(x => x.package.integrity.digest !== pkg.integrity.digest);
  const entry: ArchivedRelease = {
    archiveId: `${pkg.draft.id}:${pkg.integrity.digest.slice(0, 12)}`,
    importedAt: new Date().toISOString(), fileName, package: pkg, verifiedAt: new Date().toISOString()
  };
  write([entry, ...items]);
  return entry;
}
export function listArchivedReleases() { return read(); }
export function removeArchivedRelease(archiveId: string) { write(read().filter(x => x.archiveId !== archiveId)); }
export function clearReleaseArchive() { localStorage.removeItem(KEY); }
export function exportArchiveManifest(items = read()) {
  return JSON.stringify({ schema: "mera-word-search.creator-release-archive", version: 1, exportedAt: new Date().toISOString(), count: items.length,
    releases: items.map(x => ({ archiveId:x.archiveId, importedAt:x.importedAt, fileName:x.fileName, draftId:x.package.draft.id, title:x.package.draft.title,
      status:x.package.draft.status, readinessScore:x.package.readiness.score, ready:x.package.readiness.ready, algorithm:x.package.integrity.algorithm, digest:x.package.integrity.digest }))
  }, null, 2);
}
