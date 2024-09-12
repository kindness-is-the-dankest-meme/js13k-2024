import { π } from "./maths.ts";
import { is } from "./platform.ts";

type Position = {
  x: number;
  y: number;
};

type Rotation = {
  r: number;
};

type Size = {
  w: number;
  h: number;
};

type Prefixed<T, P extends string> = {
  [K in keyof T as `${P}${string & K}`]: T[K];
};

type Sized<T extends string> = Prefixed<Size, T>;

type Transform = Position & Rotation;

type Particle = Transform & Prefixed<Transform, "p">;

type Angle = {
  a: Particle;
  b: Particle;
  c: Particle;
  s: number; // stiffness
  t: number; // target (angle)
};

type Distance = {
  a: Particle;
  b: Particle;
  s: number; // stiffness
  t: number; // target (length)
};

type Constraint = Angle | Distance;

// Composite?
type Body = {
  ps: Particle[];
  cs: Constraint[];
  // draw function?
  // children?
};

export type State = { t: number; d: number; bds: Body[] } & Particle &
  Prefixed<Rotation, "r"> &
  Prefixed<Rotation, "l"> &
  Prefixed<Rotation, "pr"> &
  Prefixed<Rotation, "pl"> &
  Sized<"c"> &
  Sized<"w">;

type ParState = State | Partial<State>;
type SetState = ParState | ((prevState: State) => ParState);

export const { get, set } = (() => {
  let state: State = {
    // time (ms)
    t: 0,
    // direction (1 is forward, -1 is reverse)
    d: 1,
    // bodies
    bds: [],
    // current position / rotation
    x: 0,
    y: 0,
    r: 0,
    // previous position / rotation
    px: 0,
    py: 0,
    pr: 0,
    // oar rotation
    rr: 0,
    lr: π,
    // previous oar rotation
    prr: 0,
    plr: π,
    // canvas size
    cw: 0,
    ch: 0,
    // window size
    ww: 0,
    wh: 0,
  };

  const get = () => state;
  const set = (p: SetState) => {
    const nextState = typeof p === "function" ? p(state) : p;
    if (!is(nextState, state)) {
      state = {
        ...state,
        ...nextState,
      };
    }
  };

  return {
    get,
    set,
  };
})();
