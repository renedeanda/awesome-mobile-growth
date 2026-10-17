// Hands exported frames from the studio to the Workbench store preview within the same tab.
// Held in memory only: a reload or a new tab starts empty, and nothing is written to storage.
let frames: Blob[] = [];
export const setHandoffFrames = (next: Blob[]) => { frames = next.slice(0, 10); };
export const getHandoffFrames = () => frames;
