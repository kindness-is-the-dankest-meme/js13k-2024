import { on } from "./on.ts";
import { dpr, win } from "./platform.ts";
import { set } from "./state.ts";

export const resize = (c: HTMLElementTagNameMap["canvas"]): void => {
  const s = 1 / dpr;

  on(win, "resize", () => {
    const { innerWidth: hw, innerHeight: hh } = win;

    set(({ x, y, px, py }) => ({
      w: hw * dpr,
      h: hh * dpr,
      hw,
      hh,

      x: x || hw,
      y: y || hh,
      px: px || hw,
      py: py || hh,
    }));

    c.width = hw * dpr;
    c.height = hh * dpr;
    c.style.transform = `scale(${s})`;
  });

  win.dispatchEvent(new Event("resize"));
};
