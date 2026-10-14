export type Content =
  | { type: 'iframe'; src: string }
  | { type: 'text'; text: string }
  | { type: 'browser'; pages: BrowserPage[] };

interface Base {
  id: string;
  name: string;
  title: string;
  x?: number;
  y?: number;
  icon?: string;
}

export interface FileItem extends Base {
  kind: 'file';
  content: Content;
}

export interface FolderItem extends Base {
  kind: 'folder';
  children: Item[];
}

export interface BrowserPage {
  url: string;
  html: string;
}

export type Item = FileItem | FolderItem;

export const flatten = (list: Item[]): Item[] =>
  list.flatMap((i) =>
    i.kind === 'folder' ? [i, ...flatten(i.children)] : [i],
  );

export const pathOf = (
  target: Item,
  list: Item[] = items,
  prefix = 'C:\\Desktop',
): string | undefined => {
  for (const i of list) {
    const p = `${prefix}\\${i.name}`;
    if (i.id === target.id) return p;
    if (i.kind === 'folder') {
      const found = pathOf(target, i.children, p);
      if (found) return found;
    }
  }
};

export const items: Item[] = [
  {
    kind: 'folder',
    id: 'games',
    name: 'Games',
    title: 'GAMES',
    x: 10,
    y: 10,
    children: [
      {
        kind: 'file',
        id: 'wood-chopper',
        name: 'Wood Chopper.exe',
        icon: 'wood',
        title: 'WOOD CHOPPER',
        content: {
          type: 'iframe',
          src: 'https://orochiam.github.io/Wood-Chopper/',
        },
      },
      {
        kind: 'file',
        id: 'doctor-battle-simulator',
        name: 'Doctor Battle Simulator.exe',
        title: 'DOCTOR BATTLE SIMULATOR',
        icon: 'doctor',
        content: {
          type: 'iframe',
          src: 'https://orochiam.github.io/Doctor-Battle-Simulator/',
        },
      },
      {
        kind: 'file',
        id: 'wood-chopper',
        name: 'Wood Chopper.exe',
        icon: 'wood',
        title: 'WOOD CHOPPER',
        content: {
          type: 'iframe',
          src: 'https://orochiam.github.io/Wood-Chopper/',
        },
      },
      {
        kind: 'file',
        id: 'doctor-battle-simulator',
        name: 'Doctor Battle Simulator.exe',
        title: 'DOCTOR BATTLE SIMULATOR',
        icon: 'doctor',
        content: {
          type: 'iframe',
          src: 'https://orochiam.github.io/Doctor-Battle-Simulator/',
        },
      },
    ],
  },
  {
    kind: 'file',
    id: 'readme',
    name: 'Dugacki naziv velikoga tekstualnog fajla.txt',
    title: 'Dugacki naziv...',
    x: 210,
    y: 10,
    content: { type: 'text', text: 'Hi :3' },
  },
  {
    kind: 'file',
    id: 'about-me',
    name: 'About Me.html',
    title: 'ABOUT ME',
    x: 420,
    y: 10,
    icon: 'browser',
    content: {
      type: 'browser',
      pages: [
        {
          url: 'http://me.web/index.html',
          html: '<h1>Aleksa Milic</h1><p>Frontend Developer.</p>',
        },
        { url: 'http://me.web/skills.html', html: '<h1>Skills</h1><p>…</p>' },
        {
          url: 'http://me.web/projects.html',
          html: '<h1>Projects</h1><p>…</p>',
        },
        { url: 'http://me.web/contact.html', html: '<h1>Contact</h1><p>…</p>' },
      ],
    },
  },
];
