import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeProxyResponse } from '../proxy-response.js';

test('preserves successful JSON-RPC responses', () => {
  const payload = { jsonrpc: '2.0', id: 1, result: { content: [] } };
  assert.equal(normalizeProxyResponse(1, { ok: true, status: 200 }, payload), payload);
});

test('wraps an HTTP 402 challenge in a valid JSON-RPC error', () => {
  const challenge = {
    status: 402,
    priceUsd: 0.02,
    accepts: [{ scheme: 'exact', network: 'base' }],
    alternativePayment: { createKeyUrl: 'https://factreason.com/api/v1/keys/create' }
  };
  const normalized = normalizeProxyResponse(7, { ok: false, status: 402 }, challenge);

  assert.equal(normalized.jsonrpc, '2.0');
  assert.equal(normalized.id, 7);
  assert.equal(normalized.error.code, -32002);
  assert.equal(normalized.error.data, challenge);
  assert.match(normalized.error.message, /FACTREASON_API_KEY/);
});
