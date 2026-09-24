export function triggerHaptic(type: string = 'light') {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(type === 'heavy' ? 50 : 20);
  }
}
