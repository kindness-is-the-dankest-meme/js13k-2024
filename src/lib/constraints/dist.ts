import { hypot, round } from "../maths.ts";
import { stringify } from "../platform.ts";
import { Particle, SetState, State } from "../state.ts";

declare const p: HTMLElementTagNameMap["pre"];

export type Dist = {
  a: string;
  b: string;
  s: number;
  t: number;
};

export const dist =
  (ctx: CanvasRenderingContext2D, get: () => State) =>
  ({ a, b }: Dist) => {
    const { ps } = get();
    ctx.beginPath();
    ctx.moveTo(ps[a].x, ps[a].y);
    ctx.lineTo(ps[b].x, ps[b].y);
    ctx.stroke();
  };

export const relaxDist =
  (dt: number) =>
  (ps: { [id: string]: Particle }, { a, b, s, t }: Dist) => {
    let nx = ps[a].x - ps[b].x,
      ny = ps[a].y - ps[b].y;

    const m = nx * nx + ny * ny,
      c = 1 / dt,
      scale = ((t * t - m) / m) * s * c;

    nx *= scale;
    ny *= scale;

    //     if (b === "f") {
    //       p.innerText = `\
    // f:
    // a: ${a}
    // b: ${b}
    // s: ${s}
    // t: ${t}
    // m: ${m}
    // pa: ${stringify(ps[a], null, 2)}
    // pb: ${stringify(ps[b], null, 2)}
    // l: ${hypot(ps[a].x - ps[b].x, ps[a].y - ps[b].y)}
    // nx: ${round(nx * 1_000_000) / 1_000_000}
    // ny: ${round(ny * 1_000_000) / 1_000_000}
    // scale: ${scale}
    // `;
    //     }

    return {
      ...ps,
      [a]: {
        ...ps[a],
        x: ps[a].x + nx,
        y: ps[a].y + ny,
      },
      [b]: {
        ...ps[b],
        x: ps[b].x - nx,
        y: ps[b].y - ny,
      },
    };
  };
