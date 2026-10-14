import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

/* FILES, FOLDERS & WINDOWS */
const MAX_LINES = 2;

const fitName = (file: HTMLElement) => {
  const el = file.querySelector<HTMLElement>('.name p')!;
  const full = file.dataset.name!;

  el.textContent = 'A';
  const maxHeight = el.offsetHeight * MAX_LINES;
  el.textContent = full;
  if (el.offsetHeight <= maxHeight) return;

  let lo = 0;
  let hi = full.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    el.textContent = full.slice(0, mid).trimEnd() + '...';
    if (el.offsetHeight <= maxHeight) lo = mid;
    else hi = mid - 1;
  }
  el.textContent = full.slice(0, lo).trimEnd() + '...';
};

document.fonts.ready.then(() => {
  document.querySelectorAll<HTMLElement>('.file').forEach(fitName);
});

document
  .querySelectorAll<HTMLElement>('.file:not(.in-window), .window')
  .forEach((el, i) => {
    const isWindow = el.classList.contains('window');
    gsap.set(el, {
      x: Number(el.dataset.x ?? (isWindow ? 150 + i * 20 : 0)),
      y: Number(el.dataset.y ?? (isWindow ? 60 + i * 20 : 0)),
    });
    Draggable.create(el, { zIndexBoost: isWindow, dragClickables: false });
  });

const parts = (id: string) => ({
  win: document.querySelector<HTMLElement>(`[data-window="${id}"]`)!,
  tray: document.querySelector<HTMLElement>(`[data-tray="${id}"]`)!,
});

const openItem = (id: string) => {
  const { win, tray } = parts(id);
  win.classList.remove('gone');
  win.style.zIndex = String(++Draggable.zIndex); // always on top
  win.querySelectorAll<HTMLElement>('.file').forEach(fitName);
  tray.classList.remove('gone');
  tray.classList.add('active');
};

const minimizeItem = (id: string) => {
  const { win, tray } = parts(id);
  win.classList.add('gone');
  tray.classList.remove('active');
};

const closeItem = (id: string) => {
  minimizeItem(id);
  parts(id).tray.classList.add('gone');
};

document.querySelectorAll<HTMLElement>('.file').forEach((file) => {
  const id = file.dataset.open!;
  const fullName = file.dataset.name!;
  const nameEl = file.querySelector<HTMLElement>('.name p')!;
  const { win, tray } = parts(id);

  file.addEventListener('dblclick', () => {
    nameEl.textContent = fullName;
    openItem(id);
    file.focus();
  });

  file.addEventListener('focusout', () => {
    fitName(file);
    file.blur();
  });

  win
    .querySelector('.btn-minimize')!
    .addEventListener('click', () => minimizeItem(id));
  win
    .querySelector('.btn-close')!
    .addEventListener('click', () => closeItem(id));

  // tray button: restore if minimized, minimize if open
  tray.addEventListener('click', () =>
    win.classList.contains('gone') ? openItem(id) : minimizeItem(id),
  );
});

/* SELECT BOX */
const selectBox = document.querySelector<HTMLElement>('.select-box')!;

let isMouseDown = false;
let mouseDownX = 0;
let mouseDownY = 0;

document.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  mouseDownX = e.clientX;
  mouseDownY = e.clientY;
});

document.addEventListener('mouseup', () => {
  isMouseDown = false;
  selectBox.style.display = 'none';
});

document.addEventListener('mousemove', (e) => {
  if (!isMouseDown) return;

  selectBox.style.left = `${Math.min(mouseDownX, e.clientX)}px`;
  selectBox.style.top = `${Math.min(mouseDownY, e.clientY)}px`;
  selectBox.style.display = 'flex';
  selectBox.style.width = `${Math.abs(mouseDownX - e.clientX)}px`;
  selectBox.style.height = `${Math.abs(mouseDownY - e.clientY)}px`;
});

/* TASKBAR */

// Start button and menu
const startBtn = document.querySelector<HTMLImageElement>('.btn-start')!;
const startMenu = document.querySelector<HTMLElement>('.start-menu')!;

const toggleStart = (open: boolean) => {
  startMenu.classList.toggle('gone', !open);
  startBtn.src = open ? startBtn.dataset.open! : startBtn.dataset.closed!;
};

startBtn.addEventListener('click', () =>
  toggleStart(startMenu.classList.contains('gone')),
);

startMenu.querySelectorAll<HTMLElement>('[data-start]').forEach((li) => {
  li.addEventListener('click', () => {
    openItem(li.dataset.start!);
    toggleStart(false);
  });
});

// clicking anywhere outside the Start area closes the menu
document.addEventListener('mousedown', (e) => {
  if (!(e.target as HTMLElement).closest('.start')) toggleStart(false);
});

/* BROWSER (carousel of pages) */
document.querySelectorAll<HTMLElement>('.browser').forEach((browser) => {
  const pages = [...browser.querySelectorAll<HTMLElement>('.page')];
  const input = browser.querySelector<HTMLInputElement>('.url-input')!;
  const list = browser.querySelector<HTMLElement>('.address-list')!;
  const view = browser.querySelector<HTMLElement>('.browser-view')!;
  let index = 0;

  const show = (i: number) => {
    index = (i + pages.length) % pages.length;
    pages.forEach((page, n) => page.classList.toggle('gone', n !== index));
    input.value = pages[index].dataset.url!;
    view.scrollTop = 0;
    list.classList.add('gone');
  };

  browser
    .querySelector('.prev')!
    .addEventListener('click', () => show(index - 1));
  browser
    .querySelector('.next')!
    .addEventListener('click', () => show(index + 1));
  browser.querySelector('.home')!.addEventListener('click', () => show(0));

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const typed = input.value.trim().toLowerCase();
    const match = pages.findIndex(
      (p) => p.dataset.url!.toLowerCase() === typed,
    );
    show(match === -1 ? index : match);
  });

  browser
    .querySelector('.dropdown')!
    .addEventListener('click', () => list.classList.toggle('gone'));
  list
    .querySelectorAll<HTMLElement>('li')
    .forEach((li, n) => li.addEventListener('click', () => show(n)));

  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.address-field'))
      list.classList.add('gone');
  });
});
