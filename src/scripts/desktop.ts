import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

/* FILES, FOLDERS & WINDOWS */
const truncate = (text: string) => text.slice(0, 20) + '...';

// Desktop icons and windows are draggable; icons inside a folder window are not
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

  nameEl.textContent = truncate(fullName);

  // Opening and file name extension
  file.addEventListener('dblclick', () => {
    nameEl.textContent = fullName;
    windowPane.classList.remove('gone');
    trayItem.classList.remove('gone');
    file.focus();
  });

  file.addEventListener('focusout', () => {
    nameEl.textContent = truncate(fullName);
    file.blur();
  });

  // Closing
  closeButton.addEventListener('click', () => {
    windowPane.classList.add('gone');
    trayItem.classList.add('gone');
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
