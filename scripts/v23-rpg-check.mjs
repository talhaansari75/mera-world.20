import fs from 'node:fs';
const files = [
 'src/lib/store.ts',
 'src/lib/game/rpg.ts',
 'src/lib/game/combat.ts',
 'src/lib/game/story.ts',
 'src/lib/game/baseCrafting.ts',
 'src/lib/game/pets.ts',
 'src/components/screens/MetaScreens.tsx',
];
for (const f of files) if (!fs.existsSync(f)) throw new Error(`missing ${f}`);
const store=fs.readFileSync('src/lib/store.ts','utf8');
for (const needle of ['upgradePet:', 'petUpgradeCost', 'materials:', 'xp: s.xp + 40']) {
  if (!store.includes(needle)) throw new Error(`missing integration: ${needle}`);
}
const ui=fs.readFileSync('src/components/screens/MetaScreens.tsx','utf8');
if (!ui.includes('upgradePet')) throw new Error('pet UI not wired');
console.log('V23 RPG/Story/Pets/Base integration check: PASS');
