import { digestFor, type CreatorReleasePackage } from "@/lib/v40_releasePackage";

export type ReleaseVerification = {
  validSchema: boolean;
  digestMatches: boolean;
  readinessConsistent: boolean;
  verified: boolean;
  issues: string[];
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function verifyReleasePackage(input: unknown): Promise<ReleaseVerification> {
  const issues: string[] = [];
  if (!isObject(input)) return { validSchema: false, digestMatches: false, readinessConsistent: false, verified: false, issues: ["Package must be a JSON object."] };
  const pkg = input as Partial<CreatorReleasePackage>;
  const validSchema = pkg.schema === "mera-word-search-journey.creator-release" && pkg.version === 1 && !!pkg.draft && !!pkg.readiness && !!pkg.integrity;
  if (!validSchema) issues.push("Unsupported or incomplete release-package schema.");

  let digestMatches = false;
  if (validSchema && pkg.draft && pkg.readiness && pkg.integrity) {
    const readiness = pkg.readiness;
    const canonical = JSON.stringify({
      id: pkg.draft.id, title: pkg.draft.title, words: pkg.draft.words, category: pkg.draft.category,
      createdAt: pkg.draft.createdAt, updatedAt: pkg.draft.updatedAt, status: pkg.draft.status,
      readiness: { score: readiness.score, ready: readiness.ready, blockers: readiness.blockers, recommendations: readiness.recommendations,
        auditScore: readiness.auditScore, latestPlaytestScore: readiness.latestPlaytestScore }
    });
    const actual = await digestFor(canonical);
    digestMatches = actual.digest === pkg.integrity.digest;
    if (!digestMatches) issues.push("Integrity digest does not match the package contents.");
  }

  const readinessConsistent = validSchema && typeof pkg.readiness?.score === "number"
    && pkg.readiness.score >= 0 && pkg.readiness.score <= 100
    && typeof pkg.readiness.ready === "boolean";
  if (!readinessConsistent) issues.push("Publish-readiness data is invalid.");

  return { validSchema, digestMatches, readinessConsistent, verified: validSchema && digestMatches && readinessConsistent, issues };
}

export function parseReleasePackage(text: string): unknown {
  return JSON.parse(text);
}
