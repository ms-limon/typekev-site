import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';
import noop from 'lodash.noop';
import useSocket, {
  getListener,
  clearListener,
  onMessageReceived,
  initialState,
} from 'hooks/useSocket';

const HookWrapper = ({ hook }) => <div hook={hook()} />;

HookWrapper.propTypes = {
  hook: PropTypes.func.isRequired,
};

const getProps = wrapper => wrapper.find('div').props();

describe('useSocket hook', () => {
  it('returns undefined for socket, and token an empty array for messages by default', () => {
    const wrapper = shallow(<HookWrapper hook={useSocket} />);

    const {
      hook: [socket, setSocket, messages, clearMessages],
    } = getProps(wrapper);

    expect(socket).toBe(undefined);
    expect(typeof setSocket).toBe('function');
    expect(() => setSocket('wss://echo.websocket.org')).not.toThrow();
    expect(() => setSocket()).toThrow(
      "Failed to construct 'WebSocket': 1 argument required, but only 0 present.",
    );
    expect(messages).toBe(initialState);
    expect(typeof clearMessages).toBe('function');
  });

  it('passes an array of messages to setMessages and an array of prompts to setPrompts', () => {
    const messagesRef = { current: ['Test'] };
    const activities = [
      {
        from: { id: 'typekev-bot' },
        text: messagesRef.current[0],
        suggestedActions: { actions: [{ title: 'Suggested Action' }] },
      },
    ];
    const userActivities = [
      {
        from: { id: 'typekev-site-user' },
        text: messagesRef.current[0],
        suggestedActions: { actions: [{ title: 'Suggested Action' }] },
      },
    ];

    const doSetValues = onMessageReceived(
      messagesRef,
      returnedMessages =>
        expect(returnedMessages).toStrictEqual([
          ...messagesRef.current,
          ...activities.map(({ text }) => text),
        ]),
      returnedPrompts =>
        expect(returnedPrompts).toStrictEqual(
          activities.reduce(
            (accumulatedPrompts, { suggestedActions }) => [
              ...accumulatedPrompts,
              ...suggestedActions.actions.map(({ title }) => title),
            ],
            [],
          ),
        ),
    );

    doSetValues({ data: JSON.stringify({ activities }) });
    doSetValues({ data: JSON.stringify({ activities: userActivities }) });
  });

  it('calls clearMessages causing messages to return initialState', () => {
    const wrapper = shallow(<HookWrapper hook={useSocket} />);

    const {
      hook: [, , , clearMessages],
    } = getProps(wrapper);

    clearMessages();

    const {
      hook: [, , messages],
    } = getProps(wrapper);

    expect(messages).toEqual(['']);
  });

  it('calls getListener triggering addEventListener if socket evaluates to true', () => {
    const messagesRef = { current: [] };
    const addEventListener = jest.fn();
    getListener();
    expect(addEventListener.mock.calls.length).toBe(0);
    getListener({ addEventListener }, messagesRef, noop);
    expect(addEventListener.mock.calls.length).toBe(1);
  });

  it('calls clearListener triggering removeEventListener if socket evaluates to true', () => {
    const removeEventListener = jest.fn();
    clearListener()();
    expect(removeEventListener.mock.calls.length).toBe(0);
    clearListener({ removeEventListener })();
    expect(removeEventListener.mock.calls.length).toBe(1);
  });
});
