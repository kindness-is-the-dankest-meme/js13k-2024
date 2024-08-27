import type { Listener } from "./types.ts";

export const on = <T extends EventTarget, E extends keyof DocumentEventMap>(
  t: T,
  e: E,
  l: Listener<E>,
  o: boolean | AddEventListenerOptions = false
) => t.addEventListener(e, l, o);
