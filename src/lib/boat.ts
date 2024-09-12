import { atan2, cos, sin, sqrt, π, ππ } from "./maths.ts";
import { State } from "./state.ts";

const hull = (() => {
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
  const a = 155,
    h = 200,
    o = sqrt(h * h - a * a),
    i = atan2(-o, a),
    j = atan2(o, a),
    k = j - j / 3,
    p = new Path2D();

  p.ellipse(0, 0, 30, 40, 0, 0, ππ);
  p.moveTo(a + cos(i + j / 3 + π) * h, sin(k) * h);
  p.arc(a, 0, h, i + j / 3 + π, j + π);
  p.arc(-a, 0, h, i, k);
  p.closePath();

  return p;
})();

const oar = (() => {
  const p = new Path2D();

  p.rect(-20, -2, 90, 4);
  p.ellipse(90, 0, 20, 10, 0, 0, ππ);
  p.closePath();

  return p;
})();

export const boat =
  (ctx: CanvasRenderingContext2D) =>
  ({ x, y, r, rr, lr }: State) => {
    ctx.fillStyle = "hsla(50, 10%, 90%, 0.6)";
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(r);
    ctx.fill(hull, "evenodd");

    ctx.save();
    ctx.translate(45, 0);
    ctx.rotate(rr);
    ctx.fill(oar);
    ctx.restore();

    ctx.save();
    ctx.translate(-45, 0);
    ctx.rotate(lr);
    ctx.fill(oar);
    ctx.restore();

    ctx.restore();
  };
