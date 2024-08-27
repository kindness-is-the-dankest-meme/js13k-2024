export interface Listener<T extends keyof DocumentEventMap>
  extends EventListener {
  (event: DocumentEventMap[T]): void;
}
