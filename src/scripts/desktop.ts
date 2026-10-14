import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

/* FILES, FOLDERS & WINDOWS */
const MAX_LINES = 2;

const fitName = (file: HTMLElement) => {
  const el = file.querySelector<HTMLElement>('.name p')!;
  const full = file.dataset.name!;

  el.textContent = 'A';
  const maxHeight = el.offsetHeight * MAX_LINES; // height of 2 lines
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
    Draggable.create(el, { zIndexBoost: isWindow });
  });

document.querySelectorAll<HTMLElement>('.file').forEach((file) => {
  const id = file.dataset.open!;
  const fullName = file.dataset.name!;
  const nameEl = file.querySelector<HTMLElement>('.name p')!;
  const windowPane = document.querySelector<HTMLElement>(
    `[data-window="${id}"]`,
  )!;
  const trayItem = document.querySelector<HTMLElement>(`[data-tray="${id}"]`)!;
  const closeButton = windowPane.querySelector<HTMLElement>('.btn-close')!;

  file.addEventListener('focusout', () => {
    fitName(file);
    file.blur();
  });

  // Opening and file name extension
  file.addEventListener('dblclick', () => {
    nameEl.textContent = fullName;
    windowPane.classList.remove('gone');
    trayItem.classList.remove('gone');
    windowPane.querySelectorAll<HTMLElement>('.file').forEach(fitName);
    file.focus();
  });

  file.addEventListener('focusout', () => {
    file.blur();
  });

  // Closing
  closeButton.addEventListener('click', () => {
    windowPane.classList.add('gone');
    trayItem.classList.add('gone');
  });

  const minimizeButton =
    windowPane.querySelector<HTMLElement>('.btn-minimize')!;

  minimizeButton.addEventListener('click', () => {
    windowPane.classList.add('gone'); // tray item stays
  });

  // Tray item: restore if minimized, minimize if visible
  trayItem.addEventListener('click', () => {
    if (windowPane.classList.contains('gone')) {
      windowPane.classList.remove('gone');
      windowPane.style.zIndex = String(++Draggable.zIndex);
    } else {
      windowPane.classList.add('gone');
    }
  });

  file.addEventListener('dblclick', () => {
    nameEl.textContent = fullName;
    windowPane.classList.remove('gone');
    windowPane.style.zIndex = String(++Draggable.zIndex);
    trayItem.classList.remove('gone');
    file.focus();
  });
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

// Start button
const startBtn = document.querySelector<HTMLImageElement>('.btn-start')!;
let closed = true;

startBtn.addEventListener('click', () => {
  startBtn.src = closed ? startBtn.dataset.open! : startBtn.dataset.closed!;
  closed = !closed;
});

// Time and date
const timeEl = document.querySelector<HTMLElement>('.info .time')!;
const dateEl = document.querySelector<HTMLElement>('.info .date')!;

const updateDateTime = () => {
  const date = new Date();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  timeEl.textContent = `${date.getHours()}:${minutes}`;
  dateEl.textContent = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}.`;
};

updateDateTime();
setInterval(updateDateTime, 1000);
