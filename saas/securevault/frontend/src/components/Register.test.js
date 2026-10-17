import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import Register from './Register';

jest.mock('axios', () => ({ post: jest.fn() }));
const mockNavigate = jest.fn();
// CRA's Jest 27 resolver does not understand the router's package exports.
jest.mock('react-router-dom', () => ({
  Link: ({ children }) => <span>{children}</span>,
  useNavigate: () => mockNavigate
}), { virtual: true });

global.IS_REACT_ACT_ENVIRONMENT = true;
let container;
let root;
beforeEach(() => {
  jest.clearAllMocks();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

async function fillForm() {
  for (const [name, value] of Object.entries({ username: 'test-user', email: 'test@example.invalid', password: 'test-password', confirmPassword: 'test-password' })) {
    const input = container.querySelector(`[name="${name}"]`);
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }
}

test('registers, logs in, notifies the parent and navigates only after login', async () => {
  let finishRegistration;
  axios.post.mockImplementationOnce(() => new Promise(resolve => { finishRegistration = resolve; }))
    .mockResolvedValueOnce({ data: { token: 'test-token', user: { username: 'test-user' } } });
  const onRegister = jest.fn();
  await act(async () => root.render(<Register onRegister={onRegister} />));
  await fillForm();
  await act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  expect(axios.post).toHaveBeenCalledTimes(1);
  expect(onRegister).not.toHaveBeenCalled();
  expect(mockNavigate).not.toHaveBeenCalled();
  await act(async () => finishRegistration({ data: { id: 'test-id' } }));
  expect(axios.post.mock.calls).toEqual([
    [expect.stringContaining('/auth/register'), { username: 'test-user', email: 'test@example.invalid', password: 'test-password' }],
    [expect.stringContaining('/auth/login'), { username: 'test-user', password: 'test-password' }]
  ]);
  expect(onRegister).toHaveBeenCalledWith('test-token', { username: 'test-user' });
  expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  expect(onRegister.mock.invocationCallOrder[0]).toBeLessThan(mockNavigate.mock.invocationCallOrder[0]);
});

test('does not log in or navigate after registration fails', async () => {
  axios.post.mockRejectedValueOnce({ response: { data: { error: 'Inscription refusée' } } });
  const onRegister = jest.fn();
  await act(async () => root.render(<Register onRegister={onRegister} />));
  await fillForm();
  await act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  expect(container.textContent).toContain('Inscription refusée');
  expect(axios.post).toHaveBeenCalledTimes(1);
  expect(onRegister).not.toHaveBeenCalled();
  expect(mockNavigate).not.toHaveBeenCalled();
});
