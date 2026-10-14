import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/*.png',
  {
    eager: true,
  },
);

export const getIcon = (name: string | undefined, fallback: ImageMetadata) =>
  (name && images[`../assets/images/${name}.png`]?.default) || fallback;
