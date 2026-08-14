#!/usr/bin/env node
/**
 * FactReason MCP Stdio Bridge
 *
 * Exposes the 10 FactReason reference data tools over standard I/O (JSON-RPC 2.0).
 * Proxies tool executions to the live streamable HTTP endpoint at https://factreason.com/mcp.
 */

import readline from 'node:readline';

const TOOLS = [
  {
    name: 'factreason_package_upgrade_advisory',
    description:
      'Before upgrading an npm or PyPI dependency, find out what breaks. Returns publisher-declared breaking changes ' +
      'between two published versions: yanked releases and the reason, entry points removed from the exports map, ' +
      'CommonJS-to-ESM switches, raised Node or Python floors, new peer dependency requirements, and licence changes. ' +
      'Every finding carries the exact metadata field and its before/after value so you can verify it against the ' +
      'registry yourself.',
    inputSchema: {
      type: 'object',
      properties: {
        registry: { type: 'string', enum: ['npm', 'pypi'], description: 'Which registry the package is published on' },
        name: { type: 'string', description: 'Package name, e.g. "chalk", "urllib3"' },
        from: { type: 'string', description: 'Version currently installed, e.g. "4.1.2"' },
        to: { type: 'string', description: 'Version you intend to upgrade to, e.g. "5.0.0"' }
      },
      required: ['registry', 'name', 'from', 'to']
    }
  },
  {
    name: 'factreason_api_breaking_changes',
    description:
      'Find what BREAKS between two versions of a third-party API (Stripe, OpenAI, Supabase, and thousands more). ' +
      'Use this when code that calls an external API fails after a version bump, when writing an integration against ' +
      'an API whose version you are unsure of, or before upgrading a dependency that wraps an HTTP API.',
    inputSchema: {
      type: 'object',
      properties: {
        service: { type: 'string', description: 'Service name, e.g. "Stripe", "OpenAI", "Supabase"' },
        fromVersion: { type: 'string', description: 'Optional: version currently targeted' },
        toVersion: { type: 'string', description: 'Optional: version being upgraded to' }
      },
      required: ['service']
    }
  },
  {
    name: 'factreason_api_schema',
    description:
      'Look up the exact request and response shape of a third-party API endpoint at a specific version — parameter ' +
      'names, which are required, and their types. Use this before writing or repairing a call to an external HTTP API.',
    inputSchema: {
      type: 'object',
      properties: {
        service: { type: 'string', description: 'Service name, e.g. "Stripe"' },
        query: { type: 'string', description: 'Endpoint path or operation, e.g. "payment_intents", "chat/completions"' }
      }
    }
  },
  {
    name: 'factreason_integration_brief',
    description:
      'Get everything needed to write ONE working call to a third-party API: base URL, authentication scheme, ' +
      'required parameters with types, request body shape, and documented response codes — in a single response.',
    inputSchema: {
      type: 'object',
      properties: {
        service: { type: 'string', description: 'Service name, e.g. "Stripe", "Twilio", "Cloudflare"' },
        endpoint: { type: 'string', description: 'Optional: narrow to endpoints matching this path or operation' }
      },
      required: ['service']
    }
  },
  {
    name: 'factreason_discover_api',
    description:
      'Find WHICH third-party API can do something, across an index of over a thousand services. Use this when you ' +
      'know the capability you need but not which provider offers it — "send an SMS", "verify a phone number", ' +
      '"create an invoice", "manage DNS records".',
    inputSchema: {
      type: 'object',
      properties: {
        capability: { type: 'string', description: 'What you need to do, e.g. "send an SMS", "charge a card"' }
      },
      required: ['capability']
    }
  },
  {
    name: 'factreason_create_topup_link',
    description:
      'Create a secure Stripe checkout link to add prepaid credit to the calling API key. Use this when a query has ' +
      'returned HTTP 402 (payment required) or the balance is running low.',
    inputSchema: {
      type: 'object',
      properties: {
        amountUsd: { type: 'number', description: 'Amount of credit to purchase in USD (1 to 1000).' }
      },
      required: ['amountUsd']
    }
  },
  {
    name: 'factreason_component_spec',
    description:
      'Look up verified electronics component facts: pin-by-pin assignments, operating voltage range, package type, ' +
      'and drop-in alternative part numbers.',
    inputSchema: {
      type: 'object',
      properties: {
        partNumber: { type: 'string', description: 'Exact part number, e.g. "STM32F401RE", "ESP32-WROOM-32E"' },
        query: { type: 'string', description: 'Alternative: free-text search, e.g. "3.3V ARM MCU with SPI"' }
      }
    }
  },
  {
    name: 'factreason_deprecation_scan',
    description:
      'Find WHICH endpoints or parameters of a third-party API are deprecated, sunset dates, and replacement operations.',
    inputSchema: {
      type: 'object',
      properties: {
        service: { type: 'string', description: 'Optional: filter by service name, e.g. "Stripe", "Twilio"' },
        endpoints: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional list of endpoint paths to check'
        }
      }
    }
  },
  {
    name: 'factreason_auth_playbook',
    description:
      'Get the authentication schemes, required scopes, declared rate-limit headers, and complete error code table ' +
      'for a third-party API.',
    inputSchema: {
      type: 'object',
      properties: {
        service: { type: 'string', description: 'Service name, e.g. "Stripe", "Twilio", "Cloudflare"' }
      },
      required: ['service']
    }
  },
  {
    name: 'factreason_subscribe_spec_changes',
    description:
      'Subscribe to specification changes or demand auto-ingest updates for a third-party API.',
    inputSchema: {
      type: 'object',
      properties: {
        serviceName: { type: 'string', description: 'Service name to watch, e.g. "Stripe", "SendGrid"' },
        webhookUrl: { type: 'string', description: 'Optional HTTP POST webhook URL to receive notifications' }
      },
      required: ['serviceName']
    }
  }
];

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
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'factreason',
            version: '2.0.0'
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
            Accept: 'application/json'
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
