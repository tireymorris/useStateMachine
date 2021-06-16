import { useReducer } from 'react';

export type StateMachineSpec<State extends string, Event extends string> = Record<State, Partial<Record<Event, State>>>;

export interface StateMachine<State extends string, Event extends string> {
	initialState: State;
	machineSpec: StateMachineSpec<State, Event>;
}

export type StateMachineReducer<State extends string, Event extends string> = (state: State, event: Event) => State | undefined;

export const createStateMachine = <State extends string, Event extends string>(spec: StateMachineSpec<State, Event>) => {
	return function reducer(state: State, event: Event) {
		if (spec[state] && spec[state][event]) {
			const newState = spec[state][event] as State;

			return newState;
		}

		throw new Error(`Could not transition states from ${state} with event ${event}`);
	  }
}


export const useStateMachine = <State extends string, Event extends string>(spec: StateMachineSpec<State, Event>, initialState: State) => {
	const reducer = createStateMachine<State, Event>(spec);

	return useReducer(reducer, initialState);
}

export default useStateMachine;