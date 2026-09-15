import { gameEvents } from '@/lib/game/core/eventBus';
import { incrementLiveProgress } from './liveOpsService';
let cleanup: (() => void) | null = null;
let activeMode = '';
export function installLiveOpsBridge() {
  if (cleanup) return cleanup;
  const unsubs = [
    gameEvents.on('level:start', (p) => { activeMode = p.mode; }),
    gameEvents.on('word:found', () => { incrementLiveProgress('first-words'); }),
    gameEvents.on('level:complete', () => {
      incrementLiveProgress('three-clears');
      if (activeMode === 'daily') incrementLiveProgress('daily-clear');
      activeMode = '';
    }),
    gameEvents.on('level:fail', () => { activeMode = ''; }),
  ];
  cleanup = () => { unsubs.forEach((u) => u()); cleanup = null; };
  return cleanup;
}
