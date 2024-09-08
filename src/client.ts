import { boat } from "./lib/boat.ts";
import { cos, hypot, hπ, sin, sign, π, ππ } from "./lib/maths.ts";
import { on } from "./lib/on.ts";
import { dpr, entries, fromEntries, raf, win } from "./lib/platform.ts";
import { Force, get, set, type State } from "./lib/state.ts";

declare const m: HTMLElementTagNameMap["main"];
declare const c: HTMLElementTagNameMap["canvas"];

const scale = 1 / dpr,
  forward = 2,
  reverse = -2;

const onResize = () => {
  const { innerWidth: hw, innerHeight: hh } = win;

  set(({ x, y, px, py }) => ({
    w: hw * dpr,
    h: hh * dpr,
    hw,
    hh,

    x: x || hw,
    y: y || hh,
    px: px || hw,
    py: py || hh,
  }));

  c.width = hw * dpr;
  c.height = hh * dpr;
  c.style.transform = `scale(${scale})`;
};

on(win, "resize", onResize);
win.dispatchEvent(new Event("resize"));

const f = 0.99;
const forces: Force[] = [];

const onKeyDown = ({ key }: KeyboardEvent) => {
  const { r } = get();

  switch (key) {
    case "ArrowUp": {
      forces.push({
        x: -cos(r + hπ) * forward,
        y: -sin(r + hπ) * forward,
      });
      break;
    }
    case "ArrowRight": {
      forces.push({
        r: π / 720,
      });
      break;
    }
    case "ArrowDown": {
      forces.push({
        x: -cos(r + hπ) * reverse,
        y: -sin(r + hπ) * reverse,
      });
      break;
    }
    case "ArrowLeft": {
      forces.push({
        r: -π / 720,
      });
      break;
    }
  }
};

on(win, "keydown", onKeyDown);

const step = ({ t, x, y, r, px, py, pr }: State, dt: number): void => {
  let vx = (x - px) * f,
    vy = (y - py) * f,
    vr = ((r - pr) % ππ) * f;

  forces.forEach(({ x, y, r }) => {
    vx += x ?? 0;
    vy += y ?? 0;
    vr += r ?? 0;
  });
  forces.length = 0;

  const h = hypot(vx, vy),
    nr = r + vr,
    nx = x - cos(nr + hπ) * h,
    ny = y - sin(nr + hπ) * h;

  set({
    t: t + dt,
    x: nx,
    y: ny,
    r: nr,
    px: x,
    py: y,
    pr: r,
  });
};

const ctx = c.getContext("2d")!;

const draw = ({ t, x, y, r, w, h }: State): void => {
  ctx.fillStyle = "hsl(100, 40%, 60%)";
  ctx.fillRect(0, 0, w, h);

  // ctx.font = "bold 8rem sans-serif";
  // ctx.textAlign = "center";
  // ctx.textBaseline = "middle";
  // ctx.fillStyle = "hsla(50, 10%, 90%, 0.1)";
  // ctx.fillText("hello", hw, hh);

  boat(ctx, t, x, y, r);
};

const lerp = <T extends Record<PropertyKey, number>>(
  a: T,
  b: T,
  t: number
): T =>
  fromEntries(
    entries(a).map(([k, v]) => [k, v * (1 - t) + b[k as keyof T] * t])
  ) as T;

const loop = (() => {
  const dt = 10;

  let pt: DOMHighResTimeStamp = performance.now(),
    ot = 0,
    ft: number;

  return (time: DOMHighResTimeStamp) => {
    raf(loop);

    ft = time - pt;
    pt = time;
    ot += ft;

    let state = get();
    while (ot >= dt) {
      state = get();
      step(state, dt);
      ot -= dt;
    }

    draw(lerp(state, get(), ot / dt));
  };
})();

raf(loop);
