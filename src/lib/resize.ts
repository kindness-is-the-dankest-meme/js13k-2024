import { on } from "./on.ts";
import { dpr, w } from "./platform.ts";
import { set } from "./state.ts";

export const resize = (c: HTMLElementTagNameMap["canvas"]): void => {
  const s = 1 / dpr;

  on(w, "resize", () => {
    const { innerWidth: ww, innerHeight: wh } = w,
      cw = ww * dpr,
      ch = wh * dpr,
      hw = cw / 2,
      hh = ch / 2;

    set(({ x, y, px, py }) => ({
      ww,
      wh,
      cw,
      ch,

      x: x || hw,
      y: y || hh,
      px: px || hw,
      py: py || hh,
    }));

    c.width = cw;
    c.height = ch;
    c.style.transform = `scale(${s})`;
  });

  w.dispatchEvent(new Event("resize"));
};
