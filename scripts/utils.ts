import { STATUS_TEXT, type StatusCode } from "jsr:@std/http";

type Factory<T> = T extends new (...args: infer A) => infer R
  ? (...args: A) => R
  : never;

export const url: Factory<typeof URL> = (url, base) => new URL(url, base);
export const res: Factory<typeof Response> = (body, init) =>
  new Response(body, init);

export const httpStatus = (code: StatusCode) => `${code} ${STATUS_TEXT[code]}`;
