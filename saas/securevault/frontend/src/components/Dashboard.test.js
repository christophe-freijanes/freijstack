import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import Dashboard from './Dashboard';

jest.mock('axios', () => ({ get: jest.fn(), post: jest.fn() }));

global.IS_REACT_ACT_ENVIRONMENT = true;
let container;
let root;
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  localStorage.setItem('token', 'test-token');
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  axios.get.mockImplementation(url => Promise.resolve({ data: url.includes('/audit') ? { logs: [] } : { secrets: [] } }));
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  jest.restoreAllMocks();
});

test('loads each resource once on mount and does not reload on a state update or rerender', async () => {
  const onLogout = jest.fn();
  await act(async () => root.render(<Dashboard onLogout={onLogout} />));
  expect(axios.get.mock.calls.map(([url]) => url.split('/api')[1])).toEqual(['/secrets', '/audit?limit=20']);
  expect(container.textContent).toContain('Aucun secret enregistré');
  await act(async () => container.querySelectorAll('.tab')[2].click());
  await act(async () => root.render(<Dashboard onLogout={onLogout} />));
  expect(container.textContent).toContain('Paramètres du compte');
  expect(axios.get).toHaveBeenCalledTimes(2);
  expect(onLogout).not.toHaveBeenCalled();
});

test.each(['/secrets', '/audit'])('logs out when %s returns 401', async endpoint => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  const onLogout = jest.fn();
  axios.get.mockImplementation(url => url.includes(endpoint)
    ? Promise.reject({ response: { status: 401 } })
    : Promise.resolve({ data: url.includes('/audit') ? { logs: [] } : { secrets: [] } }));
  await act(async () => root.render(<Dashboard onLogout={onLogout} />));
  expect(onLogout).toHaveBeenCalledTimes(1);
});

test('reads the current token again when reloading after creating a secret', async () => {
  axios.post.mockResolvedValue({ data: {} });
  await act(async () => root.render(<Dashboard onLogout={jest.fn()} />));
  localStorage.setItem('token', 'refreshed-test-token');
  await act(async () => container.querySelector('.section-header button').click());
  await act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/secrets'), expect.any(Object), { headers: { Authorization: 'Bearer refreshed-test-token' } });
  expect(axios.get).toHaveBeenCalledTimes(4);
  for (const [, config] of axios.get.mock.calls.slice(2)) {
    expect(config.headers.Authorization).toBe('Bearer refreshed-test-token');
  }
});
