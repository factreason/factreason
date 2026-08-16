export function normalizeProxyResponse(id, response, payload) {
  if (response.ok && payload?.jsonrpc === '2.0') return payload;

  const paymentRequired = response.status === 402 || payload?.status === 402;
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: paymentRequired ? -32002 : -32603,
      message: paymentRequired
        ? 'Payment required: use the x402 requirements or create a free API key and reconnect with FACTREASON_API_KEY.'
        : `FactReason upstream returned HTTP ${response.status}.`,
      data: payload
    }
  };
}
