import HomePage from '../components/fakesites/Home.astro';
import SkillsPage from '../components/fakesites/Skills.astro';

export type PageComponent = typeof HomePage;
export interface BrowserPage {
  url: string;
  component: PageComponent;
}

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
  width?: string;
  height?: string;
}

export interface FolderItem extends Base {
  kind: 'folder';
  children: Item[];
}

export type Item = FileItem | FolderItem;

// ...flatten, pathOf and the items array unchanged

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
    x: 210,
    y: 10,
    children: [
      {
        kind: 'file',
        id: 'wood-chopper',
        name: 'Wood Chopper.exe',
        icon: 'wood',
        title: 'WOOD CHOPPER',
        width: '45vh',
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
        width: '48vh',
        height: '48vh',
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
    x: 410,
    y: 10,
    content: { type: 'text', text: 'Hi :3' },
  },
  {
    kind: 'file',
    id: 'about-me',
    name: 'About Me.html',
    title: 'ABOUT ME',
    x: 10,
    y: 10,
    icon: 'browser',
    content: {
      type: 'browser',
      pages: [
        { url: 'http://me.web/index.html', component: HomePage },
        { url: 'http://me.web/skills.html', component: SkillsPage },
      ],
    },
  },
  {
    kind: 'file',
    id: 'subway-surfers',
    name: 'Subway Surfers.mp4',
    title: 'SUBWAY SURFERS',
    icon: 'video',
    x: 610,
    y: 10,
    width: '34vh',
    content: {
      type: 'iframe',
      src: 'https://www.youtube.com/embed/QPW3XwBoQlw?controls=0&mute=1&showinfo=0',
    },
  },
];
