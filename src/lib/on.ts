interface Listener<T extends keyof DocumentEventMap> {
  (event: DocumentEventMap[T]): void;
}

export const on = <T extends EventTarget, E extends keyof DocumentEventMap>(
  t: T,
  e: E,
  l: Listener<E>,
  o: boolean | AddEventListenerOptions = false
) => t.addEventListener(e, l as EventListener, o);
