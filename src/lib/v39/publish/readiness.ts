import { auditPuzzleWordsLocal, type PuzzleAudit } from "@/lib/v36_puzzleAudit";
import { listPlaytestResults, type PlaytestResult } from "@/lib/v38/playtest/playtest";
import { listDrafts, type CreatorDraft } from "@/lib/v24/creator/creatorService";

export type PublishReadiness = {
  draft: CreatorDraft;
  audit: PuzzleAudit;
  playtests: PlaytestResult[];
  latest?: PlaytestResult;
  score: number;
  ready: boolean;
  blockers: string[];
  recommendations: string[];
};

export function evaluatePublishReadiness(draftId: string): PublishReadiness | null {
  const draft = listDrafts().find(d => d.id === draftId);
  if (!draft) return null;
  const audit = auditPuzzleWordsLocal(draft.words);
  const playtests = listPlaytestResults().filter(r => r.puzzleId === draftId);
  const latest = playtests[0];
  const blockers: string[] = [];
  const recommendations: string[] = [];
  if (!audit.ok) blockers.push("Puzzle QA audit is below the publish threshold.");
  if (!latest?.completed) blockers.push("Complete at least one full creator playtest.");
  if (latest && latest.score < 60) blockers.push("Latest playtest score is below 60.");
  if (draft.words.length < 5) recommendations.push("Add more target words for a richer puzzle.");
  if (audit.score < 80) recommendations.push("Improve word-length variety and vocabulary quality.");
  if (latest && latest.mistakes > Math.max(2, Math.ceil(draft.words.length * 0.25))) recommendations.push("Retest after checking ambiguous or hard-to-find placements.");
  const score = Math.round((Math.min(100, audit.score) * 0.6) + (latest ? latest.score * 0.4 : 0));
  return { draft, audit, playtests, latest, score, ready: blockers.length === 0, blockers, recommendations };
}

export function listPublishCandidates(): PublishReadiness[] {
  return listDrafts().filter(d => d.status !== "archived").map(d => evaluatePublishReadiness(d.id)).filter((x): x is PublishReadiness => Boolean(x));
}
