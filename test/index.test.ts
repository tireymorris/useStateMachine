import { createStateMachine, StateMachineSpec } from "../src";

type State = 'booting' | 'started' | 'ended';
type Event = 'booted' | 'failed';


const spec: StateMachineSpec<State, Event> = {
	'booting': {
		'booted': 'started'
	},
	'started': {
		'failed': 'ended'
	},
	'ended': {
	}
};

test('reducer functions as expected', () => {
    const dispatch = createStateMachine(spec);

    expect(dispatch('booting', 'booted')).toEqual('started');
    expect(dispatch('started', 'failed')).toEqual('ended');
	expect(() => dispatch('ended', 'booted')).toThrow();
})
