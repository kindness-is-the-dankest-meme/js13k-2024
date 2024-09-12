import { boat } from "./lib/boat.ts";
import { kd, ku } from "./lib/input.ts";
import {
  atan2,
  cos,
  hypot,
  hπ,
  lerp,
  round,
  sin,
  sqrt,
  π,
  ππ,
} from "./lib/maths.ts";
import { entries, raf, stringify } from "./lib/platform.ts";
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
});

type DistConfig = { a: Particle; b: Particle };

const createDistCons = ({ a, b }: DistConfig): Distance => ({
  a,
  b,
  s: 0.99,
  t: hypot(b.x - a.x, b.y - a.y),
});

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
    ps = [
      createParticle({
        x: hcw,
        y: hch + sin(i) * h,
      }),
      createParticle({
        x: hcw + 45,
        y: hch,
      }),
      createParticle({
        x: hcw - a + cos(i + j / 3) * h,
        y: hch + sin(k) * h,
      }),
      createParticle({
        x: hcw + a + cos(i + j / 3 + π) * h,
        y: hch + sin(k) * h,
      }),
      createParticle({
        x: hcw - 45,
        y: hch,
      }),
      createParticle({
        x: hcw + 135,
        y: hch,
      }),
      createParticle({
        x: hcw - 135,
        y: hch,
      }),
    ],
    cs = [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
      [3, 4],
      [1, 5],
      [4, 6],
    ].map(([a, b]) => createDistCons({ a: ps[a], b: ps[b] }));

  set({ ps, cs });
};

const f = 0.95,
  swing = 19 / 8,
  force = 0.1;

const step = (state: State, dt: number): void => {
  p.innerText = entries(state)
    .map(([k, v]) => `${k}: ${stringify(v)}`)
    .join("\n");

  const { t, d, x, y, r, px, py, pr, rr, lr, prr, plr } = state;

  let vx = (x - px) * f,
    vy = (y - py) * f,
    vr = ((r - pr) % ππ) * f,
    vrr = ((rr - prr) % ππ) * f,
    vlr = ((lr - plr) % ππ) * f,
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

  ps.forEach(({ x, y }) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, ππ);
    ctx.stroke();
    ctx.restore();
  });

  cs.forEach(({ a, b }) => {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
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
