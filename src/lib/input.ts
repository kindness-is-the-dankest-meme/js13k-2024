import { on } from "./on.ts";
import { w } from "./platform.ts";

export const kd = new Set<string>();
export const ku = new Set<string>();

on(w, "keydown", ({ key }: KeyboardEvent) => kd.add(key));
on(w, "keyup", ({ key }: KeyboardEvent) => {
  kd.delete(key);
  ku.add(key);
});
