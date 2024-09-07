import { boat } from "./lib/boat.ts";
import { on } from "./lib/on.ts";
import { cos, sin, π, ππ, hπ } from "./lib/maths.ts";
import { win, dpr, raf, fromEntries, entries } from "./lib/platform.ts";
import { get, set, type State } from "./lib/state.ts";

declare const m: HTMLElementTagNameMap["main"];
declare const c: HTMLElementTagNameMap["canvas"];

const scale = 1 / dpr,
  forward = 30,
  reverse = -10;

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

const onKeyUp = ({ key }: KeyboardEvent) => {
  switch (key) {
    case "ArrowUp": {
      set(({ x, y, r }) => ({
        x: x! - cos(r + hπ) * forward,
        y: y! - sin(r + hπ) * forward,
      }));
      break;
    }
    case "ArrowRight": {
      set(({ r }) => ({
        r: (r + π / 20) % ππ,
      }));
      break;
    }
    case "ArrowDown": {
      set(({ x, y, r }) => ({
        x: x! - cos(r + hπ) * reverse,
        y: y! - sin(r + hπ) * reverse,
      }));
      break;
    }
    case "ArrowLeft": {
      set(({ r }) => ({
        r: (r - π / 20) % ππ,
      }));
      break;
    }
  }
};

on(win, "keyup", onKeyUp);

const ctx = c.getContext("2d")!;

const step = ({ t }: State, dt: number): void => {
  set({ t: t + dt });
};

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
