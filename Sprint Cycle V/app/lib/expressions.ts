export type Expression = {
  id: string;
  name: string;
  mood: string;
};

export const beyondGifs: Expression[] = [
  { id: "affection", name: "Affection", mood: "affection" },
  { id: "angry", name: "Angry", mood: "angry" },
  { id: "aww", name: "Aww", mood: "aww" },
  { id: "blush", name: "Blush", mood: "blush" },
  { id: "cheer", name: "Cheer", mood: "cheer" },
  { id: "congratulations", name: "Congratulations", mood: "congratulations" },
  { id: "cry", name: "Cry", mood: "cry" },
  { id: "curious", name: "Curious", mood: "curious" },
  { id: "cursed", name: "Cursed", mood: "cursed" },
  { id: "dance", name: "Dance", mood: "dance" },
  { id: "eating", name: "Eating", mood: "eating" },
  { id: "evil", name: "Evil", mood: "evil" },
  { id: "frustrated", name: "Frustrated", mood: "frustrated" },
  { id: "hungry", name: "Hungry", mood: "hungry" },
  { id: "laugh", name: "Laugh", mood: "laugh" },
  { id: "love", name: "Love", mood: "love" },
  { id: "nauseous", name: "Nauseous", mood: "nauseous" },
  { id: "nervous", name: "Nervous", mood: "nervous" },
  { id: "on-my-way", name: "On My Way", mood: "on-my-way" },
  { id: "sad", name: "Sad", mood: "sad" },
  { id: "scared", name: "Scared", mood: "scared" },
  { id: "sleep", name: "Sleep", mood: "sleep" },
  { id: "smile", name: "Smile", mood: "smile" },
  { id: "smirk", name: "Smirk", mood: "smirk" },
  { id: "surprised", name: "Surprised", mood: "surprised" },
  { id: "thanks", name: "Thanks", mood: "thanks" },
  { id: "thinking", name: "Thinking", mood: "thinking" },
  { id: "unamused", name: "Unamused", mood: "unamused" },
  { id: "wave", name: "Wave", mood: "wave" },
];

const gifById = new Map(beyondGifs.map((item) => [item.id, item]));

export function readExpression(value: string) {
  const match = /^xpression-gif:([a-z0-9-]+)$/.exec(value.trim());
  if (!match) return null;
  const item = gifById.get(match[1]);
  if (!item) return null;
  return { kind: "gif" as const, item };
}
