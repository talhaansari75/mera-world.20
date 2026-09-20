import { useEffect, useMemo, useRef, useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Screen } from '@/components/screens/chrome';
import { useGame } from '@/lib/store';
import { parseVoiceCommand, speechLocale } from '@/lib/v34/voice/voiceCommands';

type Recognition = { lang: string; continuous: boolean; interimResults: boolean; start: () => void; stop: () => void; onresult: ((e: any) => void) | null; onerror: ((e: any) => void) | null; onend: (() => void) | null };
type WindowWithSpeech = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

export function VoiceCommandScreen() {
  const language = useGame(s => s.save.language);
  const go = useGame.getState().go;
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState('');
  const [status, setStatus] = useState('Ready');
  const recognition = useRef<Recognition | null>(null);
  const supported = useMemo(() => typeof window !== 'undefined' && !!((window as WindowWithSpeech).SpeechRecognition || (window as WindowWithSpeech).webkitSpeechRecognition), []);

  const speak = (text: string) => { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(text)); } };
  const run = (text: string) => {
    setHeard(text);
    const command = parseVoiceCommand(text);
    if (command.action === 'navigate' || command.action === 'home') { setStatus(`Opening ${command.screen}`); speak(`Opening ${command.screen}`); if (command.screen) go(command.screen); }
    else if (command.action === 'back') { setStatus('Going back'); speak('Going back'); go('more'); }
    else { setStatus('Command not recognized'); speak('I did not recognize that command'); }
  };
  const start = () => {
    if (!supported) { setStatus('Speech recognition is not supported in this browser'); return; }
    const Ctor = (window as WindowWithSpeech).SpeechRecognition || (window as WindowWithSpeech).webkitSpeechRecognition!;
    const r = new Ctor(); r.lang = speechLocale(language); r.continuous = false; r.interimResults = false;
    r.onresult = e => run(e.results?.[0]?.[0]?.transcript ?? ''); r.onerror = () => { setListening(false); setStatus('Microphone or speech recognition error'); }; r.onend = () => setListening(false);
    recognition.current = r; setListening(true); setStatus(`Listening in ${r.lang}`); r.start();
  };
  const stop = () => { recognition.current?.stop(); setListening(false); setStatus('Stopped'); };
  useEffect(() => () => recognition.current?.stop(), []);

  return <Screen title="Voice Command Center"><div className="flex flex-col gap-4">
    <section className="panel rounded-2xl p-5"><div className="flex items-center gap-3"><Volume2 className="size-6 text-primary"/><div><p className="text-xs uppercase tracking-wider text-primary">Voice + NLP</p><h2 className="font-display text-2xl text-fg">Hands-free controls</h2></div></div><p className="mt-2 text-sm text-muted">Speak a simple command to navigate the game. Recognition stays in your browser; no audio is uploaded by this feature.</p></section>
    <button type="button" disabled={!supported} onClick={listening ? stop : start} className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-semibold text-primary-foreground disabled:opacity-50">{listening ? <MicOff className="size-5"/> : <Mic className="size-5"/>}{listening ? 'Stop listening' : 'Start listening'}</button>
    <section className="panel rounded-2xl p-4"><p className="text-xs uppercase tracking-wider text-muted">Status</p><p className="mt-1 font-semibold text-fg">{status}</p>{heard && <p className="mt-3 text-sm text-muted">Heard: “{heard}”</p>}</section>
    <section className="panel rounded-2xl p-4"><h3 className="font-semibold text-fg">Try saying</h3><div className="mt-3 grid gap-2 text-sm text-muted"><p>“Open achievements”</p><p>“Go to settings”</p><p>“Show analytics”</p><p>“Open creator”</p><p>“Start multiplayer”</p><p>“Go home”</p></div></section>
  </div></Screen>;
}
