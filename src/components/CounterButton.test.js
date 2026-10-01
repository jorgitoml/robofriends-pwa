import React from 'react';
import ReactDOM from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import CounterButton from './CounterButton';

describe('CounterButton', () => {
  it('increments its count when clicked', () => {
    // Render into a detached DOM node (jsdom-compatible, synchronous).
    const div = document.createElement('div');
    ReactDOM.render(<CounterButton color="blue" />, div);

    const button = div.querySelector('button');
    expect(button).toBeDefined();
    expect(button.textContent).toContain('1');

    // Simulate a click and verify the count increments.
    Simulate.click(button);
    expect(button).toBeDefined();
    expect(button.textContent).toContain('2');

    // Clean up.
    ReactDOM.unmountComponentAtNode(div);
  });
});
