import { useState } from 'react';
import { Users, UserPlus, Shield, Trash2 } from 'lucide-react';
import { Screen } from '@/components/screens/chrome';
import { addFriend, getClan, joinClan, leaveClan, listFriends, removeFriend } from '@/lib/v10/social/socialService';
import { validDisplayName, validClanName } from '@/lib/v10/validation/socialValidation';

export function SocialScreen() {
  const [friends, setFriends] = useState(listFriends);
  const [clan, setClan] = useState(getClan);
  const [name, setName] = useState('');
  const [clanName, setClanName] = useState('');
  const refresh = () => setFriends(listFriends());
  return <Screen title="Friends & Clans">
    <section className="panel rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2"><Users className="size-5 text-primary" /><h2 className="font-display text-xl text-fg">Friends</h2></div>
      <div className="flex gap-2"><input value={name} onChange={(e) => setName(e.target.value.slice(0,24))} placeholder="Player name" className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-fg" /><button className="hud-chip text-fg" onClick={() => { if (!validDisplayName(name)) return; if (addFriend(name)) { setName(''); refresh(); } }}><UserPlus className="mr-1 inline size-4"/>Add</button></div>
      <div className="mt-3 flex flex-col gap-2">{friends.map((f) => <div key={f.id} className="flex items-center justify-between rounded-xl border border-border p-3"><span className="text-fg">{f.name} <small className="text-muted">{f.online ? 'online' : 'offline'}</small></span><button aria-label={`Remove ${f.name}`} onClick={() => { removeFriend(f.id); refresh(); }}><Trash2 className="size-4 text-muted"/></button></div>)}</div>
    </section>
    <section className="panel mt-3 rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2"><Shield className="size-5 text-primary"/><h2 className="font-display text-xl text-fg">Clan</h2></div>
      {clan ? <div className="flex items-center justify-between"><div><p className="font-semibold text-fg">{clan.name}</p><p className="text-sm text-muted">{clan.members} member · {clan.weeklyScore} weekly points</p></div><button className="hud-chip text-fg" onClick={() => { leaveClan(); setClan(null); }}>Leave</button></div> : <div className="flex gap-2"><input value={clanName} onChange={(e) => setClanName(e.target.value.slice(0,32))} placeholder="Clan name" className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-fg"/><button className="hud-chip text-fg" onClick={() => { if (!validClanName(clanName)) return; const next = joinClan(clanName); if (next) { setClan(next); setClanName(''); } }}>Create</button></div>}
    </section>
  </Screen>;
}
