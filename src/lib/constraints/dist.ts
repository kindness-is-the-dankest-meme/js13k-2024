import { Particle, SetState, State } from "../state.ts";

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
      c = 1 / dt;

    for (let i = 0; i < dt; ++i) {
      nx *= ((t * t - m) / m) * s * c;
      ny *= ((t * t - m) / m) * s * c;
    }

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
