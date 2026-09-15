import { useState } from "react";
import { CheckCircle2, ShieldAlert, Upload } from "lucide-react";
import { Screen } from "@/components/screens/chrome";
import { useGame } from "@/lib/store";
import { parseReleasePackage, verifyReleasePackage, type ReleaseVerification } from "@/lib/v41_releaseVerifier";

export function ReleaseVerifierScreen() {
  const go = useGame.getState().go;
  const [result, setResult] = useState<ReleaseVerification | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const inspect = async (file: File) => {
    setBusy(true); setName(file.name); setResult(null);
    try {
      const text = await file.text();
      setResult(await verifyReleasePackage(parseReleasePackage(text)));
    } catch (error) {
      setResult({ validSchema: false, digestMatches: false, readinessConsistent: false, verified: false, issues: [error instanceof Error ? `Invalid JSON: ${error.message}` : "Could not read this package."] });
    } finally { setBusy(false); }
  };
  return <Screen title="Release Verifier">
    <div className="grid gap-4">
      <section className="panel rounded-2xl p-5">
        <p className="text-xs uppercase tracking-wider text-primary">V41 creator verification</p>
        <h2 className="font-display mt-1 text-2xl text-fg">Verify a release package</h2>
        <p className="mt-2 text-sm text-muted">Import a V40 release JSON and independently check its schema, readiness data and integrity digest. Verification is local and never uploads the file.</p>
      </section>
      <label className="panel flex cursor-pointer items-center justify-center gap-3 rounded-2xl p-5 text-sm font-semibold text-fg">
        <Upload className="size-5 text-primary" />
        <span>{busy ? "Verifying…" : name || "Choose release JSON"}</span>
        <input type="file" accept="application/json,.json" className="sr-only" disabled={busy} onChange={(e) => { const file = e.target.files?.[0]; if (file) void inspect(file); }} />
      </label>
      {result && <section className="panel rounded-2xl p-5">
        <div className="flex items-center gap-2 text-fg">{result.verified ? <CheckCircle2 className="size-5 text-primary" /> : <ShieldAlert className="size-5 text-gold" />}<b>{result.verified ? "Package verified" : "Verification failed"}</b></div>
        <div className="mt-4 grid gap-2 text-sm text-muted">
          <p><b className="text-fg">Schema:</b> {result.validSchema ? "valid" : "invalid"}</p>
          <p><b className="text-fg">Integrity:</b> {result.digestMatches ? "matches" : "does not match"}</p>
          <p><b className="text-fg">Readiness:</b> {result.readinessConsistent ? "valid" : "invalid"}</p>
        </div>
        {result.issues.length > 0 && <div className="mt-4 grid gap-2">{result.issues.map((issue) => <p key={issue} className="rounded-xl border border-border p-3 text-sm text-muted">{issue}</p>)}</div>}
      </section>}
      <div className="flex flex-wrap gap-4"><button onClick={() => go("releasePackage")} className="text-sm text-primary">← Release Package</button><button onClick={() => go("creator")} className="text-sm text-primary">Creator Studio →</button><button onClick={() => go("more")} className="text-sm text-muted">More</button></div>
    </div>
  </Screen>;
}
