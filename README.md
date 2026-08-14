# FactReason

**Reference data agents need before they write code.** Dependency upgrade advisories for npm and PyPI, developer API schemas across 1,097 services, and electronic component specifications — over MCP, Ed25519-signed, with the evidence attached.

MCP endpoint: `https://factreason.com/mcp` · [Agent-readable docs](https://factreason.com/llms.txt) · [factreason.com](https://factreason.com)

---

## Stop an agent shipping a broken dependency upgrade

Your agent wants to bump `chalk` from 4.1.2 to 5.0.0. Before it edits `package.json`, it asks what breaks:

```
GET /api/v1/packages/npm/chalk/advisory?from=4.1.2&to=5.0.0
Authorization: Bearer <key>
```

```json
{
  "found": true,
  "packageName": "chalk",
  "fromVersion": "4.1.2",
  "toVersion": "5.0.0",
  "breakingCount": 2,
  "advisories": [
    {
      "severity": "breaking",
      "changeType": "MODULE_FORMAT_CHANGED",
      "description": "chalk 5.0.0 changed module format from \"commonjs (undeclared)\" to \"module\". CommonJS require() of this package will now fail.",
      "evidenceField": "type",
      "evidenceBefore": null,
      "evidenceAfter": "module",
      "migrationHint": "Convert the call site to import(), or pin to the last CommonJS release."
    },
    {
      "severity": "breaking",
      "changeType": "RUNTIME_REQUIREMENT_RAISED",
      "description": "chalk 5.0.0 raised its runtime requirement from \">=10\" to \"^12.17.0 || ^14.13 || >=16.0.0\". Older runtimes are no longer supported.",
      "evidenceField": "engines.node",
      "evidenceBefore": ">=10",
      "evidenceAfter": "^12.17.0 || ^14.13 || >=16.0.0",
      "migrationHint": "Confirm the deployment runtime satisfies the new floor before upgrading."
    }
  ]
}
```

Via MCP, the same question is one tool call:

```json
{
  "name": "factreason_package_upgrade_advisory",
  "arguments": { "registry": "npm", "name": "chalk", "from": "4.1.2", "to": "5.0.0" }
}
```

**Every finding carries `evidenceField`, `evidenceBefore` and `evidenceAfter`** — the exact registry metadata field and its values either side of the change. An agent can verify the claim against npm or PyPI directly rather than taking our word for it.

---

## Connect

Streamable HTTP. No install, no package to pull.

```json
{
  "mcpServers": {
    "factreason": {
      "type": "http",
      "url": "https://factreason.com/mcp"
    }
  }
}
```

Manifest: [`/.well-known/mcp.json`](https://factreason.com/.well-known/mcp.json)

Get a key — no signup, no card:

```bash
curl -X POST https://factreason.com/api/v1/keys/create \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com"}'
```

---

## Tools

| Tool | What it answers |
|---|---|
| `factreason_package_upgrade_advisory` | What breaks between two published npm/PyPI versions |
| `factreason_api_schema` | Exact request/response shape of an API endpoint at a version |
| `factreason_integration_brief` | Everything needed to write one working call to an API |
| `factreason_discover_api` | Which of 1,097 services can do X |
| `factreason_deprecation_scan` | Which endpoints are deprecated, sunset dates, replacements |
| `factreason_auth_playbook` | Auth schemes, scopes, rate-limit headers, error-code table |
| `factreason_component_spec` | Electronics component pinouts, voltages, packages |
| `factreason_subscribe_spec_changes` | Webhook or polling callback when a spec changes |
| `factreason_create_topup_link` | Stripe checkout link when credit runs out |

---

## Proof-of-Fact Signatures

Every response is signed by our Ed25519 private key:

- `X-FactReason-Signature`: Ed25519 signature of the raw response payload
- `X-FactReason-Key-Id`: Stable signing key identifier
- `X-FactReason-Signature-Alg`: `ed25519`

Public keys are published and rotated via JWKS at `https://factreason.com/.well-known/jwks.json`.

---

## Licence & Contact

MIT. Attribution requirement for APIs.guru source data: CC-BY 4.0.
Questions, support, or data reports: `hello@factreason.com`.
