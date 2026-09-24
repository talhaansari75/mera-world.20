export type DialogueChoice = { id: string; text: string; next?: string; affinity?: number; reward?: number };
export type DialogueNode = { id: string; speaker: string; text: string; choices: DialogueChoice[] };

export const DIALOGUES: Record<string, DialogueNode> = {
  ch1_intro: {
    id: "ch1_intro",
    speaker: "Mira the Archivist",
    text: "The meadow is waking. Every hidden word is part of an ancient map.",
    choices: [
      { id: "help", text: "I'll help you find the map.", next: "ch1_help", affinity: 2 },
      { id: "ask", text: "What happened here?", next: "ch1_help", affinity: 1 },
    ],
  },
  ch1_help: {
    id: "ch1_help",
    speaker: "Mira the Archivist",
    text: "Then begin with the first trail. Bring me your discoveries.",
    choices: [{ id: "accept", text: "Quest accepted.", next: "end", reward: 50 }],
  },
  ch2_intro: {
    id: "ch2_intro",
    speaker: "Rowan the Ranger",
    text: "The cedar forest changes when the wrong words are spoken.",
    choices: [
      { id: "careful", text: "I'll tread carefully.", next: "end", affinity: 2, reward: 60 },
      { id: "brave", text: "Let the forest test me.", next: "end", affinity: 1, reward: 40 },
    ],
  },
  ch3_intro: {
    id: "ch3_intro",
    speaker: "Orin the Climber",
    text: "The mountain keeps its oath to those who solve its inscriptions.",
    choices: [{ id: "climb", text: "Show me the path.", next: "end", affinity: 2, reward: 80 }],
  },
  ch4_intro: {
    id: "ch4_intro",
    speaker: "Safa the Cartographer",
    text: "The dunes erased my route. Your word trail can restore it.",
    choices: [{ id: "map", text: "I'll restore the route.", next: "end", affinity: 2, reward: 100 }],
  },
  ch5_intro: {
    id: "ch5_intro",
    speaker: "Lyra the Stargazer",
    text: "Look beyond the grid. The stars are spelling something.",
    choices: [{ id: "stars", text: "I'll follow the stars.", next: "end", affinity: 2, reward: 120 }],
  },
  ch6_intro: {
    id: "ch6_intro",
    speaker: "Aero the Keeper",
    text: "The Sky Archives are full of doors that open only to knowledge.",
    choices: [{ id: "learn", text: "Knowledge is my key.", next: "end", affinity: 2, reward: 150 }],
  },
  ch7_intro: {
    id: "ch7_intro",
    speaker: "Nyx the Warden",
    text: "The abyss feeds on forgotten words. Do not let it win.",
    choices: [{ id: "stand", text: "I will stand against it.", next: "end", affinity: 3, reward: 200 }],
  },
  ch8_intro: {
    id: "ch8_intro",
    speaker: "Atlas Prime",
    text: "You reached the final atlas. Now discover why this journey began.",
    choices: [{ id: "final", text: "Reveal the truth.", next: "end", affinity: 5, reward: 500 }],
  },
};

export function dialogueForChapter(chapter: number) {
  return DIALOGUES[`ch${chapter}_intro`] ?? DIALOGUES.ch1_intro!;
}

export function dialogueById(id: string) {
  return DIALOGUES[id];
}
