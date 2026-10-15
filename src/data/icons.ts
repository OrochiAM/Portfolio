import { asset } from './assets';

// name from items.ts ('game'), or the fallback ('file' / 'folder')
export const getIcon = (name: string | undefined, fallback: string) =>
  asset(`images/${name ?? fallback}.png`);
