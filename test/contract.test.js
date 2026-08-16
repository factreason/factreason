import assert from 'node:assert/strict';
import test from 'node:test';
import { TOOLS } from '../tools.js';

test('publishes the complete FactReason MCP contract', () => {
  assert.equal(TOOLS.length, 10);
  assert.equal(new Set(TOOLS.map(tool => tool.name)).size, TOOLS.length);

  for (const tool of TOOLS) {
    assert.equal(tool.inputSchema.type, 'object', `${tool.name} input schema`);
    assert.equal(tool.inputSchema.additionalProperties, false, `${tool.name} rejects unknown inputs`);
    assert.equal(tool.outputSchema.type, 'object', `${tool.name} output schema`);
    assert.equal(typeof tool.annotations.readOnlyHint, 'boolean', `${tool.name} read-only annotation`);
    assert.equal(typeof tool.annotations.destructiveHint, 'boolean', `${tool.name} destructive annotation`);
    assert.equal(typeof tool.annotations.idempotentHint, 'boolean', `${tool.name} idempotent annotation`);
    assert.equal(typeof tool.annotations.openWorldHint, 'boolean', `${tool.name} open-world annotation`);
  }

  const advisory = TOOLS.find(tool => tool.name === 'factreason_package_upgrade_advisory');
  assert.match(advisory.description, /metered lookup/);
  assert.doesNotMatch(advisory.description, /unbilled catalogue lookup/);
});
