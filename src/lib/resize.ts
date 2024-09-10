import { on } from "./on.ts";
import { dpr, w } from "./platform.ts";
import { set } from "./state.ts";

export const resize = (c: HTMLElementTagNameMap["canvas"]): void => {
  const s = 1 / dpr;

  on(w, "resize", () => {
    const { innerWidth: ww, innerHeight: wh } = w;

    set(({ x, y, px, py }) => ({
      ww,
      wh,
      w: ww * dpr,
      h: wh * dpr,

      x: x || ww,
      y: y || wh,
      px: px || ww,
      py: py || wh,
    }));

    c.width = ww * dpr;
    c.height = wh * dpr;
    c.style.transform = `scale(${s})`;
  });

  w.dispatchEvent(new Event("resize"));
};
