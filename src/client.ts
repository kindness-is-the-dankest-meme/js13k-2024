import { on } from "./lib/on.ts";

declare const m: HTMLElementTagNameMap["main"];
declare const c: HTMLElementTagNameMap["canvas"];

const win = window;
const { devicePixelRatio: dpr, requestAnimationFrame: raf } = win;
const { PI: π } = Math;
const ππ = π * 2;

const scale = 1 / dpr;
let w: number, h: number, hw: number, hh: number, x: number, y: number;

const onResize = () => {
  ({ innerWidth: hw, innerHeight: hh } = win);
  x ??= hw;
  y ??= hh;
  w = hw * dpr;
  h = hh * dpr;

  c.width = w;
  c.height = h;
  c.style.transform = `scale(${scale})`;
};

on(win, "resize", onResize);
win.dispatchEvent(new Event("resize"));

const onKeyUp = ({ key }: KeyboardEvent) => {
  switch (key) {
    case "ArrowUp": {
      y -= 20;
      break;
    }
    case "ArrowRight": {
      x += 20;
      break;
    }
    case "ArrowDown": {
      y += 20;
      break;
    }
    case "ArrowLeft": {
      x -= 20;
      break;
    }
  }
};

on(win, "keyup", onKeyUp);

const ctx = c.getContext("2d")!;
const draw = () => {
  raf(draw);

  ctx.fillStyle = "hsl(100, 40%, 60%)";
  ctx.fillRect(0, 0, w, h);

  ctx.font = "bold 8rem sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "hsla(50, 10%, 90%, 0.1)";
  ctx.fillText("hello", hw, hh);

  ctx.fillStyle = "hsla(50, 10%, 90%, 0.6)";
  ctx.beginPath();
  ctx.ellipse(x, y, 20, 20, 0, 0, ππ);
  ctx.fill();
};

raf(draw);
