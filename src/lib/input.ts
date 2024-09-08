import { on } from "./on.ts";
import { win } from "./platform.ts";

export const kd = new Set<string>();
export const ku = new Set<string>();

on(win, "keydown", ({ key }: KeyboardEvent) => kd.add(key));
on(win, "keyup", ({ key }: KeyboardEvent) => {
  kd.delete(key);
  ku.add(key);
});
