export function fitName(file: HTMLElement) {
  const p = file.querySelector<HTMLElement>('.name p')!;
  const full = file.dataset.name!;
  const max = parseFloat(getComputedStyle(p).lineHeight) * 2 + 1;

  p.textContent = full;
  if (p.offsetHeight <= max) return;

  let lo = 0;
  let hi = full.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    p.textContent = full.slice(0, mid).trimEnd() + '...';
    if (p.offsetHeight <= max) lo = mid;
    else hi = mid - 1;
  }
  p.textContent = full.slice(0, lo).trimEnd() + '...';
}
