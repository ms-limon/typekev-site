import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';
import useSocket, {
  setListener,
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
    expect(messages).toBe(initialState);
    expect(typeof clearMessages).toBe('function');
  });

  it('calls onMessageReceived passing an array of messages to setMessages', () => {
    const messages = ['Test'];
    const activities = [{ from: { id: 'typekev-bot' }, text: messages[0] }];
    onMessageReceived(messages, returnedMessages =>
      expect(returnedMessages).toStrictEqual([...messages, ...activities.map(({ text }) => text)]),
    )({ data: JSON.stringify({ activities }) });
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

    expect(messages).toBe(initialState);
  });

  it('calls setListener triggering addEventListener if socket evaluates to true', () => {
    const addEventListener = jest.fn();
    setListener()();
    expect(addEventListener.mock.calls.length).toBe(0);
    setListener({ addEventListener }, [], () => {})();
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
