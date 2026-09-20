import { useEffect, useState } from 'react';
import { readJson, writeJson } from '@/lib/v9/services/localPersistence';

type Status = { lastOpen: number; opens: number };
export function V9Status() {
  const [status, setStatus] = useState<Status>(() => readJson<Status>('status') ?? { lastOpen: 0, opens: 0 });
  useEffect(() => { const next = { lastOpen: Date.now(), opens: status.opens + 1 }; writeJson('status', next); setStatus(next); }, []);
  return <span className="sr-only" aria-hidden="true">V9 session {status.opens}</span>;
}
