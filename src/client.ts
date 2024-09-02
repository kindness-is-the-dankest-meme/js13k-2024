import { boat } from "./lib/boat.ts";
import { on } from "./lib/on.ts";
import { cos, sin, π, ππ, hπ } from "./lib/maths.ts";

declare const m: HTMLElementTagNameMap["main"];
declare const c: HTMLElementTagNameMap["canvas"];

const win = window;
const { devicePixelRatio: dpr, requestAnimationFrame: raf } = win;

const scale = 1 / dpr,
  forward = 30,
  reverse = -10;
let w: number,
  h: number,
  hw: number,
  hh: number,
  x: number,
  y: number,
  r = 0,
  px: number,
  py: number,
  pr = 0;

const onResize = () => {
  ({ innerWidth: hw, innerHeight: hh } = win);
  x = px ??= hw;
  y = py ??= hh;
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
      x -= cos(r + hπ) * forward;
      y -= sin(r + hπ) * forward;
      break;
    }
    case "ArrowRight": {
      r += π / 20;
      r %= ππ;
      break;
    }
    case "ArrowDown": {
      x -= cos(r + hπ) * reverse;
      y -= sin(r + hπ) * reverse;
      break;
    }
    case "ArrowLeft": {
      r -= π / 20;
      r %= ππ;
      break;
    }
  }
};

on(win, "keyup", onKeyUp);

const ctx = c.getContext("2d")!;

const draw = (t: DOMHighResTimeStamp) => {
  raf(draw);

  ctx.fillStyle = "hsl(100, 40%, 60%)";
  ctx.fillRect(0, 0, w, h);

  // ctx.font = "bold 8rem sans-serif";
  // ctx.textAlign = "center";
  // ctx.textBaseline = "middle";
  // ctx.fillStyle = "hsla(50, 10%, 90%, 0.1)";
  // ctx.fillText("hello", hw, hh);

  boat(ctx, t, x, y, r);
};

raf(draw);
