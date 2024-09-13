import { entries, fromEntries, isArray, stringify } from "./platform.ts";

export const { atan2, cos, hypot, min, PI: π, round, sign, sin, sqrt } = Math;
export const ππ = π * 2,
  hπ = π / 2;

type Arr = Array<Val>;
type Num = number; // this type is `number`
type Obj = { [key: PropertyKey]: Val };
type Val =
  | Arr
  | bigint
  | boolean
  | null
  | Num
  | Obj
  | string
  | symbol
  | undefined;

const isArr = (x: unknown): x is Arr => isArray(x);

const lerpArr = (as: Arr, bs: Arr, t: number): Arr =>
  as.reduce<Arr>(
    (acc, a, i) => (canLerp(a, bs[i]) && acc.push(lerp(a, bs[i], t)), acc),
    []
  );

const isNum = (x: unknown): x is Num => typeof x === "number";

/**
 * prefer precise method
 * @see: https://github.com/mattdesl/lerp/blob/master/index.js
 * @see: https://en.wikipedia.org/wiki/Linear_interpolation#Programming_language_support
 */
const lerpNum = (a: Num, b: Num, t: number): Num => (1 - t) * a + t * b;

const specialKeys = ["s", "t", "w", "h"];

const shouldLerp = (k: string) => !specialKeys.some((sk) => k.includes(sk));

const isObj = (x: unknown): x is Obj =>
  x != null && !isArr(x) && typeof x === "object";

const lerpObj = (a: Obj, b: Obj, t: number): Obj =>
  fromEntries(
    entries(a).reduce<[string, Val][]>(
      (acc, [k, v]) => (
        canLerp(v, b[k]) && shouldLerp(k)
          ? acc.push([k, lerp(v, b[k], t)])
          : acc.push([k, v]),
        acc
      ),
      []
    )
  );

const canLerp = (a: unknown, b: unknown): boolean =>
  a != null && b != null && typeof a === typeof b;

export const lerp = <T>(a: T, b: T, t: number): T => {
  switch (true) {
    case isArr(a) && isArr(b): {
      return lerpArr(a, b, t) as T;
    }
    case isNum(a) && isNum(b): {
      return lerpNum(a, b, t) as T;
    }
    case isObj(a) && isObj(b): {
      return lerpObj(a, b, t) as T;
    }
    case canLerp(a, b): {
      return round(1 - t) ? a : b;
    }
    default: {
      throw new Error(
        `Cannot \`lerp(${stringify(a)}, ${stringify(b)}, ${t})\``
      );
    }
  }
};
