import { Draggable } from 'gsap/Draggable';
import { fitName } from './fitName';

export const parts = (id: string) => ({
  win: document.querySelector<HTMLElement>(`[data-window="${id}"]`)!,
  tray: document.querySelector<HTMLElement>(`[data-tray="${id}"]`)!,
});

export const openItem = (id: string) => {
  const { win, tray } = parts(id);
  win.classList.remove('gone');
  tray.classList.remove('gone');
  tray.classList.add('active');
  win.style.zIndex = String(++Draggable.zIndex); // always on top
  // icons inside a hidden window can't be measured until it is visible
  win.querySelectorAll<HTMLElement>('.file').forEach(fitName);
};

export const minimizeItem = (id: string) => {
  const { win, tray } = parts(id);
  win.classList.add('gone');
  tray.classList.remove('active');
};

export const closeItem = (id: string) => {
  const { win, tray } = parts(id);
  win.classList.add('gone');
  tray.classList.add('gone');
  tray.classList.remove('active');
};
