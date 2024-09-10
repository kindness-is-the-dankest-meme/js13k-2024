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

type Sized<T extends string> = {
  [D in keyof Size as `${T}${D}`]: Size[D];
};

type Transform = Position & Rotation;

type Particle = Transform & {
  [D in keyof Transform as `p${D}`]: Transform[D];
};

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
};

export type State = { t: number } & Sized<"c"> & Sized<"w"> & Particle;

type ParState = State | Partial<State>;
type SetState = ParState | ((prevState: State) => ParState);

export const { get, set } = (() => {
  let state: State = {
    // time (ms)
    t: 0,
    // current position / rotation
    x: 0,
    y: 0,
    r: 0,
    // previous position / rotation
    px: 0,
    py: 0,
    pr: 0,
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
