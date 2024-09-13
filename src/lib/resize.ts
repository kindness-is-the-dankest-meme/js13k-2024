import { on } from "./on.ts";
import { dpr, w } from "./platform.ts";
import { set } from "./state.ts";

export const resize = (c: HTMLElementTagNameMap["canvas"]): void => {
  const s = 1 / dpr;

  on(w, "resize", () => {
    const { innerWidth: ww, innerHeight: wh } = w,
      cw = ww * dpr,
      ch = wh * dpr,
      hcw = cw / 2,
      hch = ch / 2;

    set(({ x, y, px, py }) => ({
      x: x || hcw,
      y: y || hch,
      px: px || hcw,
      py: py || hch,

      cw,
      ch,

      hcw,
      hch,

      ww,
      wh,
    }));

    c.width = cw;
    c.height = ch;
    c.style.transform = `scale(${s})`;
  });

  w.dispatchEvent(new Event("resize"));
};
