export interface Listener<T extends keyof DocumentEventMap> {
  (event: DocumentEventMap[T]): void;
}
