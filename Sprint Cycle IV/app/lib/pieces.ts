export type Piece =
  | { kind: "writing"; preview: string; paragraphs: string[] }
  | { kind: "lyrics"; preview: string; lines: string[] }
  | { kind: "painting"; preview: string };

const pieces: Record<string, Piece> = {
  "1": {
    kind: "writing",
    preview: "The last city bus keeps its lights low.",
    paragraphs: [
      "The last city bus keeps its lights low.",
      "Someone sleeps against the window with a grocery bag for a pillow. A man in a work shirt counts the stops on his fingers and then stops counting. The driver calls streets that nobody is getting off for.",
      "At the depot the doors open on a bright room. The people who stayed stand up one by one, as if the ride had been the place they meant to go.",
      "The bus idles. Its lights stay on in the glass, a small room that has not finished arriving.",
    ],
  },
  "2": {
    kind: "writing",
    preview: "The announcement board goes dark while we are still on the platform.",
    paragraphs: [
      "The announcement board goes dark while we are still on the platform. For a minute the letters hang there as an afterimage, then there is only the metal frame and our faces in it.",
      "Nobody asks when the train is coming. A woman folds her ticket until it is too small to read. The overhead lights buzz, and the far end of the platform is already night.",
      "I keep waiting because leaving would mean deciding the board was the last thing that knew the schedule. When a headlight finally shows, it looks less like an arrival than like someone turning a lamp back on.",
    ],
  },
  "3": {
    kind: "painting",
    preview: "A studio wall with leftover marks and two taped sketches.",
  },
  "4": {
    kind: "lyrics",
    preview: "The room keeps a low sound after the take.",
    lines: [
      "The room keeps a low sound after the take.",
      "Water moves under the window.",
      "I leave the first lines almost spoken.",
      "",
      "A light on the far pier",
      "goes out and comes back.",
      "I count four bars of nothing",
      "but the harbor in the mic.",
      "",
      "Then the chorus, late on purpose:",
      "stay with the room tone,",
      "stay till the vocal finds the water,",
      "stay.",
    ],
  },
  "5": {
    kind: "writing",
    preview: "Last night I paid $4 at Sal's. The cheese slid off in one sheet.",
    paragraphs: [
      "I need somewhere to put this that isn't the group chat, because the group chat told me to drop it and I wasn't done.",
      "Last night I paid $4 at Sal's. The cheese slid off in one sheet. I asked them to hold the pineapple and they put more on. I said that in the chat. Three people told me I was being dramatic.",
      "I went back this morning. The guy at the counter said, \"that's how the slice is.\" So now it's here. This is not a pineapple argument. It's a $4 slice that tastes like a candle. If somebody from that shop wants to explain it, the comments are open.",
    ],
  },
};

export function pieceFor(id: string) {
  return pieces[id] || null;
}

export function piecePreview(id: string, fallback: string) {
  return pieces[id]?.preview || fallback;
}
