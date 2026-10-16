// One reading speed for the whole site so labels stay comparable between pages.
export const WORDS_PER_MINUTE = 220;

export function countWords(text: string) {
  return text.split(/\s+/).filter(Boolean).length;
}

export function readingTime(text: string) {
  return `${Math.max(1, Math.round(countWords(text) / WORDS_PER_MINUTE))} min read`;
}
