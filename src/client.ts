import { on } from "./lib/on.ts";

declare const m: HTMLElementTagNameMap["main"];
declare const c: HTMLElementTagNameMap["canvas"];

const win = window;
const { devicePixelRatio: dpr, requestAnimationFrame: raf } = win;
const { atan2, cos, PI: π, sin, sqrt } = Math;
const ππ = π * 2;

const scale = 1 / dpr,
  forward = 30,
  reverse = -10;
let w: number,
  h: number,
  hw: number,
  hh: number,
  x: number,
  y: number,
  r = 0;

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
      x -= cos(r + π / 2) * forward;
      y -= sin(r + π / 2) * forward;
      break;
    }
    case "ArrowRight": {
      r += π / 20;
      r %= ππ;
      break;
    }
    case "ArrowDown": {
      x -= cos(r + π / 2) * reverse;
      y -= sin(r + π / 2) * reverse;
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

const draw = () => {
  raf(draw);

  ctx.fillStyle = "hsl(100, 40%, 60%)";
  ctx.fillRect(0, 0, w, h);

  // ctx.font = "bold 8rem sans-serif";
  // ctx.textAlign = "center";
  // ctx.textBaseline = "middle";
  // ctx.fillStyle = "hsla(50, 10%, 90%, 0.1)";
  // ctx.fillText("hello", hw, hh);

  const adj = 155;
  const hyp = 200;

  const a1x = adj;
  const a2x = -adj;

  const opp = sqrt(hyp * hyp - adj * adj);

  const a = atan2(-opp, adj);
  const b = atan2(opp, adj);
  const c = b - b / 3;

  const p = new Path2D();
  p.ellipse(0, 0, 30, 40, 0, 0, ππ);
  p.moveTo(a1x + cos(a + b / 3 + π) * hyp, sin(c) * hyp);
  p.arc(a1x, 0, hyp, a + b / 3 + π, b + π);
  p.arc(a2x, 0, hyp, a, c);
  p.closePath();

  ctx.fillStyle = "hsla(50, 10%, 90%, 0.6)";
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(r);
  ctx.fill(p, "evenodd");
  ctx.restore();
};

raf(draw);
