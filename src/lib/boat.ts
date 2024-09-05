import { atan2, cos, sin, sqrt, π, ππ } from "./maths.ts";

const hull = (() => {
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

  p.rect(-20, -2, 80, 4);
  p.ellipse(80, 0, 20, 10, 0, 0, ππ);
  p.closePath();

  return p;
})();

const swing = 19 / 8;

export const boat = (
  ctx: CanvasRenderingContext2D,
  t: number,
  x: number,
  y: number,
  r: number
) => {
  ctx.fillStyle = "hsla(50, 10%, 90%, 0.6)";
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(r);
  ctx.fill(hull, "evenodd");

  const a = sin(t / 400) * (π / swing);

  ctx.save();
  ctx.translate(32, 0);
  ctx.rotate(a);
  ctx.fill(oar);
  ctx.restore();

  ctx.save();
  ctx.translate(-32, 0);
  ctx.rotate(-a + π);
  ctx.fill(oar);
  ctx.restore();

  ctx.restore();
};
