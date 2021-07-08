import {
    createStateMachine,
    createStateMachineBuilder,
    StateMachineSpec,
    useStateMachine,
} from '../src';
import { renderHook, act } from '@testing-library/react-hooks';

type State = 'booting' | 'started' | 'ended';
type Event = 'booted' | 'failed';

const spec = {
    booting: {
        booted: 'started',
    },
    started: {
        failed: 'ended',
    },
    ended: {},
};

test('reducer functions as expected', () => {
    const dispatch = createStateMachine(spec);

    expect(dispatch('booting', 'booted')).toEqual('started');
    expect(dispatch('started', 'failed')).toEqual('ended');
    expect(() => dispatch('ended', 'booted')).toThrow();
});

test('hook functions correctly', () => {
    const { result } = renderHook(() => useStateMachine(spec, 'booting'));
    const [_, dispatch] = result.current;

    act(() => {
        dispatch('booted');
    });
    expect(result.current[0]).toBe('started');

    act(() => {
        dispatch('failed');
    });
    expect(result.current[0]).toBe('ended');
});

test('can use builder pattern', () => {
    const { result } = renderHook(() =>
        createStateMachineBuilder()
            .withTransition('booting', 'booted', 'started')
            .withTransition('started', 'failed', 'ended')
            .buildWithInitialState('booting')
    );
    const [_, dispatch] = result.current;

    act(() => {
        dispatch('booted');
    });
    expect(result.current[0]).toBe('started');

    act(() => {
        dispatch('failed');
    });
    expect(result.current[0]).toBe('ended');
});
