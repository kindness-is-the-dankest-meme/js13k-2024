import { is } from "./platform.ts";

export type State = {
  // time (ms)
  t: number;
  // current position / rotation
  x: number;
  y: number;
  r: number;
  // previous position / rotation
  px: number;
  py: number;
  pr: number;
  // canvas size
  w: number;
  h: number;
  // window size
  hw: number;
  hh: number;
};

type ParState = State | Partial<State>;
type SetState = ParState | ((prevState: State) => ParState);

export const { get, set } = (() => {
  let state: State = {
    t: 0,
    x: 0,
    y: 0,
    r: 0,
    px: 0,
    py: 0,
    pr: 0,
    w: 0,
    h: 0,
    hw: 0,
    hh: 0,
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
