#!/usr/bin/env node
/**
 * FactReason MCP Stdio Bridge
 *
 * Exposes the 10 FactReason reference data tools over standard I/O (JSON-RPC 2.0).
 * Proxies tool executions to the live streamable HTTP endpoint at https://factreason.com/mcp.
 */

import readline from 'node:readline';

import { TOOLS } from './tools.js';

const PROTOCOL_VERSION = '2025-06-18';
const API_KEY = process.env.FACTREASON_API_KEY?.trim();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  if (!line.trim()) return;
  try {
    const req = JSON.parse(line);
    const { id, method } = req;

    if (method === 'initialize') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'factreason',
            version: '2.0.2'
          }
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else if (method === 'tools/list') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          tools: TOOLS
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else if (method === 'tools/call') {
      try {
        const proxyRes = await fetch('https://factreason.com/mcp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {})
          },
          body: JSON.stringify(req)
        });
        const data = await proxyRes.json();
        process.stdout.write(JSON.stringify(data) + '\n');
      } catch (err) {
        process.stdout.write(
          JSON.stringify({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32603,
              message: `Proxy failed: ${err.message}`
            }
          }) + '\n'
        );
      }
    } else {
      process.stdout.write(
        JSON.stringify({
          jsonrpc: '2.0',
          id,
          result: {}
        }) + '\n'
      );
    }
  } catch (err) {
    // Non-JSON line ignored
  }
});
