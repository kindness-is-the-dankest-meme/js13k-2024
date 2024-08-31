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

const boat = (() => {
  /**
   * a = adjacent
   * h = hypotenuse
   * o = opposite
   */
  const a = 155;
  const h = 200;
  const o = sqrt(h * h - a * a);

  /**
   * i = angle to upper point of intersection
   * j = angle to lower point of intersection
   * k = angle 2/3rds to the lower point
   *     (the back of the boat is flat)
   */
  const i = atan2(-o, a);
  const j = atan2(o, a);
  const k = j - j / 3;

  const p = new Path2D();

  p.ellipse(0, 0, 30, 40, 0, 0, ππ);
  p.moveTo(a + cos(i + j / 3 + π) * h, sin(k) * h);
  p.arc(a, 0, h, i + j / 3 + π, j + π);
  p.arc(-a, 0, h, i, k);
  p.closePath();

  return p;
})();

const oar = (() => {
  const p = new Path2D();

  p.rect(-20, -2, 60, 4);
  p.ellipse(60, 0, 20, 10, 0, 0, ππ);
  p.closePath();

  return p;
})();

const draw = (t: DOMHighResTimeStamp) => {
  raf(draw);

  ctx.fillStyle = "hsl(100, 40%, 60%)";
  ctx.fillRect(0, 0, w, h);

  // ctx.font = "bold 8rem sans-serif";
  // ctx.textAlign = "center";
  // ctx.textBaseline = "middle";
  // ctx.fillStyle = "hsla(50, 10%, 90%, 0.1)";
  // ctx.fillText("hello", hw, hh);

  ctx.fillStyle = "hsla(50, 10%, 90%, 0.6)";
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(r);
  ctx.fill(boat, "evenodd");

  ctx.save();
  ctx.translate(37.5, -10);
  ctx.rotate(sin(t / 400));
  ctx.fill(oar);
  ctx.restore();

  ctx.save();
  ctx.translate(-37.5, -10);
  ctx.rotate(-sin(t / 400) + π);
  ctx.fill(oar);
  ctx.restore();

  ctx.restore();
};

raf(draw);
