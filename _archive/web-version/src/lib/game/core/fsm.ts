export type StateHandler<S extends string, C> = {
  enter?: (context: C) => void;
  exit?: (context: C) => void;
};

export class StateMachine<S extends string, C> {
  private currentState: S;
  private readonly states: Record<S, StateHandler<S, C>>;
  private readonly context: C;

  constructor(initial: S, states: Record<S, StateHandler<S, C>>, context: C) {
    this.currentState = initial;
    this.states = states;
    this.context = context;
    this.states[initial]?.enter?.(context);
  }

  get state() {
    return this.currentState;
  }

  transition(next: S) {
    if (next === this.currentState) return;
    this.states[this.currentState]?.exit?.(this.context);
    this.currentState = next;
    this.states[next]?.enter?.(this.context);
  }
}
