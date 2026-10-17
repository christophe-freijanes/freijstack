'use strict';

const express = require('express');
const proxyaddr = require('proxy-addr');

function request(peer, forwarded) {
  return { socket: { remoteAddress: peer }, headers: { 'x-forwarded-for': forwarded } };
}

// Cover both trustSingle and trustMulti, including mapped socket addresses.
describe.each([
  ['single subnet', subnet => [subnet]],
  ['multiple subnets', subnet => [subnet, '192.0.2.0/24']],
])('%s', (name, subnets) => {
  test.each(['203.0.113.9', '::ffff:203.0.113.9', '::1'])(
    'short mapped prefix must not trust peer %s or its forged header', peer => {
      const trust = proxyaddr.compile(subnets('::ffff:10.0.0.0/8'));
      expect(trust(peer)).toBe(false);
      expect(proxyaddr(request(peer, '198.51.100.7'), trust)).toBe(peer);
    }
  );

  test.each(['10.0.0.0/8', '::ffff:10.0.0.0/104'])(
    'valid IPv4 subnet %s preserves trusted and untrusted hops', subnet => {
      const trust = proxyaddr.compile(subnets(subnet));
      for (const peer of ['10.1.2.3', '::ffff:10.1.2.3']) {
        expect(trust(peer)).toBe(true);
        expect(proxyaddr(request(peer, '198.51.100.7'), trust)).toBe('198.51.100.7');
        expect(proxyaddr(request(peer, '198.51.100.7, 203.0.113.9'), trust)).toBe('203.0.113.9');
      }
      for (const peer of ['203.0.113.9', '::ffff:203.0.113.9', '::1']) {
        expect(trust(peer)).toBe(false);
      }
    }
  );

  test('native IPv6 subnets do not accidentally trust IPv4', () => {
    const trust = proxyaddr.compile(subnets('2001:db8::/32'));
    expect(trust('2001:db8::1')).toBe(true);
    expect(trust('2001:db9::1')).toBe(false);
    for (const peer of ['203.0.113.9', '::ffff:203.0.113.9']) {
      expect(proxyaddr.compile(subnets('::/1'))(peer)).toBe(false);
      expect(trust(peer)).toBe(false);
    }
  });
});

test('Express one-hop trust keeps the nearest forwarded hop for IPv4 and IPv6', () => {
  const app = express();
  app.set('trust proxy', 1); // Mirrors src/server.js; no subnet compilation.
  for (const peer of ['10.1.2.3', '::ffff:10.1.2.3', '2001:db8::1']) {
    const req = Object.assign(Object.create(app.request), request(peer, '198.51.100.7, 203.0.113.9'), { app });
    expect(req.ip).toBe('203.0.113.9');
    expect(req.ips).toEqual(['203.0.113.9']);
  }
});
