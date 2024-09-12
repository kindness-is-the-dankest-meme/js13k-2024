import { boat } from "./lib/boat.ts";
import { kd, ku } from "./lib/input.ts";
import { atan2, cos, hypot, hπ, lerp, sin, sqrt, π, ππ } from "./lib/maths.ts";
import { dup, entries, raf, stringify, values } from "./lib/platform.ts";
import { resize } from "./lib/resize.ts";
import {
  Distance,
  get,
  Particle,
  Position,
  Prefixed,
  Rotation,
  set,
  type State,
} from "./lib/state.ts";

declare const m: HTMLElementTagNameMap["main"];
declare const c: HTMLElementTagNameMap["canvas"];
declare const p: HTMLElementTagNameMap["pre"];

resize(c);

type TransformConfig = Position & Partial<Rotation>;
type ParticleConfig = TransformConfig & Partial<Prefixed<TransformConfig, "p">>;

const createParticle = ({ x, y, r, px, py, pr }: ParticleConfig): Particle => ({
    x,
    y,
    r: r ?? 0,
    px: px ?? x,
    py: py ?? y,
    pr: pr ?? r ?? 0,
  }),
  stiffness = 0.99;

const init = () => {
  /**
   * a = adjacent
   * h = hypotenuse
   * o = opposite
   *
   * i = angle to upper point of intersection
   * j = angle to lower point of intersection
   * k = angle 2/3rds to the lower point
   *     (the back of the boat is flat)
   */
  const { hcw, hch } = get(),
    a = 155,
    h = 200,
    o = sqrt(h * h - a * a),
    i = atan2(-o, a),
    j = atan2(o, a),
    k = j - j / 3,
    ps = {
      a: createParticle({
        x: hcw,
        y: hch + sin(i) * h,
      }),
      b: createParticle({
        x: hcw + 45,
        y: hch,
      }),
      c: createParticle({
        x: hcw - a + cos(i + j / 3) * h,
        y: hch + sin(k) * h,
      }),
      d: createParticle({
        x: hcw + a + cos(i + j / 3 + π) * h,
        y: hch + sin(k) * h,
      }),
      e: createParticle({
        x: hcw - 45,
        y: hch,
      }),
      f: createParticle({
        x: hcw + 135,
        y: hch,
      }),
      g: createParticle({
        x: hcw - 135,
        y: hch,
      }),
    },
    cs = (
      [
        ["a", "b"],
        ["a", "c"],
        ["a", "d"],
        ["a", "e"],
        ["b", "c"],
        ["b", "d"],
        ["b", "e"],
        ["c", "d"],
        ["c", "e"],
        ["d", "e"],
        ["b", "f"],
        ["e", "g"],
      ] as unknown as [keyof typeof ps, keyof typeof ps][]
    ).map(([a, b]) => ({
      a,
      b,
      s: stiffness,
      t: hypot(ps[b].x - ps[a].x, ps[b].y - ps[a].y),
    }));

  set({ ps, cs });
};

const friction = 0.95,
  swing = 19 / 8,
  force = 0.1;

const step = (state: State, dt: number): void => {
  p.innerText = entries(state)
    .map(([k, v]) => `${k}: ${stringify(v)}`)
    .join("\n");

  const { t, d, ps, cs, x, y, r, px, py, pr, rr, lr, prr, plr } = state,
    nps = dup(ps);

  let vx = (x - px) * friction,
    vy = (y - py) * friction,
    vr = ((r - pr) % ππ) * friction,
    vrr = ((rr - prr) % ππ) * friction,
    vlr = ((lr - plr) % ππ) * friction,
    trr = rr,
    tlr = lr,
    nd = d;

  if (kd.has("ArrowUp")) {
    trr = -π / swing;
    tlr = -trr + π;
  }

  if (kd.has("ArrowRight")) {
    tlr = hπ / swing + π;
  }

  if (kd.has("ArrowDown")) {
    trr = hπ / swing;
    tlr = -trr + π;
  }

  if (kd.has("ArrowLeft")) {
    trr = -hπ / swing;
  }

  nps["f"].px = nps["f"].x;
  nps["f"].py = nps["f"].y;
  nps["f"].x = nps["b"].x + cos(trr) * cs[10].t;
  nps["f"].y = nps["b"].y + sin(trr) * cs[10].t;

  nps["g"].px = nps["g"].x;
  nps["g"].py = nps["g"].y;
  nps["g"].x = nps["e"].x + cos(tlr) * cs[11].t;
  nps["g"].y = nps["e"].y + sin(tlr) * cs[11].t;

  vrr = (trr - rr) * force;
  vlr = (tlr - lr) * force;

  if (ku.delete("ArrowUp")) {
    const nvx = cos(r - hπ) * 5,
      nvy = sin(r - hπ) * 5;
    nd = hypot(vx + nvx, vy + nvy) > hypot(vx, vy) ? -1 : 1;
    vx += nvx;
    vy += nvy;
  }

  if (ku.delete("ArrowRight")) {
    vr += π / 180;
  }

  if (ku.delete("ArrowDown")) {
    const nvx = cos(r + hπ) * 2,
      nvy = sin(r + hπ) * 2;
    nd = hypot(vx + nvx, vy + nvy) > hypot(vx, vy) ? 1 : -1;
    vx += nvx;
    vy += nvy;
  }

  if (ku.delete("ArrowLeft")) {
    vr += -π / 180;
  }

  const h = hypot(vx, vy),
    nr = r + vr,
    nx = x + cos(nr + hπ * d) * h,
    ny = y + sin(nr + hπ * d) * h,
    nrr = rr + vrr,
    nlr = lr + vlr;

  p.innerText += [
    "\n",
    `vr: ${vr}`,
    `vx: ${vx}`,
    `vy: ${vy}`,
    `vrr: ${vrr}`,
    `vlr: ${vlr}`,
    "",
    `h: ${h}`,
    `nr: ${nr}`,
    `nx: ${nx}`,
    `ny: ${ny}`,
    `nrr: ${nrr}`,
    `nlr: ${nlr}`,
  ].join("\n");

  set({
    t: t + dt,
    d: nd,
    ps: nps,
    x: nx,
    y: ny,
    r: nr,
    px: x,
    py: y,
    pr: r,
    rr: nrr,
    lr: nlr,
    prr: rr,
    plr: lr,
  });
};

const ctx = c.getContext("2d")!,
  b = boat(ctx);

const draw = (state: State): void => {
  const { ps, cs, cw, ch /* , ww, wh */ } = state;

  ctx.fillStyle = "hsl(100, 40%, 60%)";
  ctx.fillRect(0, 0, cw, ch);

  // ctx.font = "bold 8rem Georgia";
  // ctx.textAlign = "center";
  // ctx.textBaseline = "middle";
  // ctx.fillStyle = "hsla(50, 10%, 90%, 0.2)";
  // ctx.fillText("13 Rivers", ww, wh);

  b(state);

  values(ps).forEach(({ x, y }) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, ππ);
    ctx.stroke();
    ctx.restore();
  });

  cs.forEach(({ a, b }) => {
    ctx.beginPath();
    ctx.moveTo(ps[a].x, ps[a].y);
    ctx.lineTo(ps[b].x, ps[b].y);
    ctx.stroke();
  });
};

const loop = (() => {
  const dt = 10;

  let pt: DOMHighResTimeStamp = performance.now(),
    ot = 0,
    ft = 0;

  init();

  return (t: DOMHighResTimeStamp) => {
    raf(loop);

    ft = t - pt;
    pt = t;
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
