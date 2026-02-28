/* GSAP */
document.addEventListener('DOMContentLoaded', (event) => {
  gsap.registerPlugin(Draggable, {});

  Draggable.create('.file');
  Draggable.create('.window');
});

/* FILES */
const file = document.querySelector('.file');
const x = document.querySelector('.btn-close');
const windowPane = document.querySelector('.window');
const fileName = file.children[1].children[0];
let fileNameText = fileName.innerHTML;

fileName.innerHTML = fileNameText.slice(0, 20) + '...';

// Opening and file name extension
file.addEventListener('dblclick', () => {
  fileName.innerHTML = fileNameText;
  windowPane.classList.remove('gone');

  file.focus();
});

file.addEventListener('focusout', () => {
  fileName.innerHTML = fileNameText.slice(0, 20) + '...';

  file.blur();
});

// Closing
x.addEventListener('click', () => {
  windowPane.classList.add('gone');
});

// Select Box

const selectBox = document.querySelector('.select-box');

let isMouseDown = false;

let mouseDownX = 0;
let mouseDownY = 0;

document.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  mouseDownX = e.clientX;
  mouseDownY = e.clientY;
});

document.addEventListener('mouseup', (e) => {
  isMouseDown = false;
  selectBox.style.display = 'none';
});

document.addEventListener('mousemove', (e) => {
  let x = e.clientX;
  let y = e.clientY;

  if (x < mouseDownX) {
    selectBox.style.left = `${Math.abs(mouseDownX - (mouseDownX - x))}px`;
  } else {
    selectBox.style.left = `${mouseDownX}px`;
  }

  if (y < mouseDownY) {
    selectBox.style.top = `${Math.abs(mouseDownY - (mouseDownY - y))}px`;
  } else {
    selectBox.style.top = `${mouseDownY}px`;
  }

  if (isMouseDown) {
    selectBox.style.display = 'flex';
    console.log(x);
    selectBox.style.width = `${Math.abs(mouseDownX - x)}px`;
    selectBox.style.height = `${Math.abs(mouseDownY - y)}px`;
    console.log(mouseDownX - e.clientX);
  }
});
/* TASKBAR */

// Start dugme
const startBtn = document.querySelector('.btn-start');

let closed = true;

startBtn.addEventListener('click', () => {
  if (closed) {
    startBtn.src = 'images/start.svg';
    closed = false;
  } else {
    startBtn.src = 'images/start-meh.svg';
    closed = true;
  }
});

// Time and date
const info = document.querySelector('.info');

const changeInfoDateTime = () => {
  let date = new Date();

  let time = `${date.getHours()}:${
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  }`;

  let today = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}.`;
  info.children[0].innerHTML = time;
  info.children[1].innerHTML = today;
};

changeInfoDateTime();

setInterval(changeInfoDateTime, 1000);
