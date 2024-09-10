import { boat } from "./lib/boat.ts";
import { kd, ku } from "./lib/input.ts";
import { cos, hypot, hπ, lerp, sin, π, ππ } from "./lib/maths.ts";
import { entries, raf } from "./lib/platform.ts";
import { resize } from "./lib/resize.ts";
import { get, set, type State } from "./lib/state.ts";

declare const m: HTMLElementTagNameMap["main"];
declare const c: HTMLElementTagNameMap["canvas"];
declare const p: HTMLElementTagNameMap["pre"];

resize(c);

const f = 0.95;
let d = 1;

const step = (state: State, dt: number): void => {
  p.innerText = entries(state)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const { t, x, y, r, px, py, pr } = state;

  let vx = (x - px) * f,
    vy = (y - py) * f,
    vr = ((r - pr) % ππ) * f;

  if (ku.has("ArrowUp")) {
    const nvx = cos(r - hπ) * 5;
    const nvy = sin(r - hπ) * 5;
    d = hypot(vx + nvx, vy + nvy) > hypot(vx, vy) ? -1 : 1;
    vx += nvx;
    vy += nvy;
  }

  if (ku.has("ArrowRight")) {
    vr += π / 180;
  }

  if (ku.has("ArrowDown")) {
    const nvx = cos(r + hπ) * 2;
    const nvy = sin(r + hπ) * 2;
    d = hypot(vx + nvx, vy + nvy) > hypot(vx, vy) ? 1 : -1;
    vx += nvx;
    vy += nvy;
  }

  if (ku.has("ArrowLeft")) {
    vr += -π / 180;
  }

  ku.clear();

  const h = hypot(vx, vy),
    nr = r + vr,
    nx = x + cos(nr + hπ * d) * h,
    ny = y + sin(nr + hπ * d) * h;

  p.innerText += [
    "\n",
    `vr: ${vr}`,
    `vx: ${vx}`,
    `vy: ${vy}`,
    "\n",
    `h: ${h}`,
    `nr: ${nr}`,
    `nx: ${nx}`,
    `ny: ${ny}`,
  ].join("\n");

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
const b = boat(ctx);

const draw = (state: State): void => {
  const { cw, ch } = state;
  ctx.fillStyle = "hsl(100, 40%, 60%)";
  ctx.fillRect(0, 0, cw, ch);

  // ctx.font = "bold 8rem sans-serif";
  // ctx.textAlign = "center";
  // ctx.textBaseline = "middle";
  // ctx.fillStyle = "hsla(50, 10%, 90%, 0.1)";
  // ctx.fillText("hello", hw, hh);

  b(state);
};

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
