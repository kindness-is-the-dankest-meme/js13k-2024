import { on } from "./on.ts";
import { dpr, w } from "./platform.ts";
import { set } from "./state.ts";

export const resize = (c: HTMLElementTagNameMap["canvas"]): void => {
  const s = 1 / dpr;

  on(w, "resize", () => {
    const { innerWidth: hw, innerHeight: hh } = w;

    set(({ x, y, px, py }) => ({
      hw,
      hh,
      w: hw * dpr,
      h: hh * dpr,

      x: x || hw,
      y: y || hh,
      px: px || hw,
      py: py || hh,
    }));

    c.width = hw * dpr;
    c.height = hh * dpr;
    c.style.transform = `scale(${s})`;
  });

  w.dispatchEvent(new Event("resize"));
};
