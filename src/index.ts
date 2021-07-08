import React, { useReducer } from 'react';

export type StateMachineSpec<
    State extends string,
    Event extends string
> = Record<State, Partial<Record<Event, State>>>;

export interface StateMachine<State extends string, Event extends string> {
    initialState: State;
    machineSpec: StateMachineSpec<State, Event>;
}

export type StateMachineReducer<State extends string, Event extends string> = (
    state: State,
    event: Event
) => State | undefined;

export const createStateMachine = <State extends string, Event extends string>(
    spec: StateMachineSpec<State, Event>
) => {
    return function reducer(state: State, event: Event) {
        if (spec[state] && spec[state][event]) {
            const newState = spec[state][event] as State;

            return newState;
        }

        throw new Error(
            `Could not transition states from ${state} with event ${event}`
        );
    };
};

export const useStateMachine = <State extends string, Event extends string>(
    spec: StateMachineSpec<State, Event>,
    initialState: State
): [State, React.Dispatch<Event>] => {
    const reducer = createStateMachine<State, Event>(spec);

    return useReducer(reducer, initialState);
};

export default useStateMachine;

export const createStateMachineBuilder = <
    State extends string,
    Event extends string
>() => {
    const spec: StateMachineSpec<State, Event> = {} as StateMachineSpec<
        State,
        Event
    >;

    return {
        withTransition: function (
            fromState: State,
            byEvent: Event,
            toState: State
        ) {
            if (!spec[fromState]) {
                spec[fromState] = {};
            }
            spec[fromState][byEvent] = toState;

            return this;
        },
        buildWithInitialState: (initialState: State) =>
            useStateMachine(spec, initialState),
    };
};
