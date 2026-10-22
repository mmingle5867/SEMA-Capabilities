import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

// Capability definitions (D-156): one folder per capability, named by its key; one file per published version.
// Each file is what Core takes to publish that capability version, so it is checked here the way Core checks it.
const root = new URL('../definitions/', import.meta.url);
let count = 0;
for (const folder of readdirSync(root)) {
  assert.match(folder, /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)+$/, `${folder}: a capability key`);
  for (const file of readdirSync(new URL(`${folder}/`, root))) {
    const where = `${folder}/${file}`;
    assert.match(file, /^\d+\.\d+\.\d+\.json$/, `${where}: named by its version`);
    const definition = JSON.parse(readFileSync(new URL(where, root), 'utf8'));
    assert.equal(definition.capabilityKey, folder, `${where}: key matches its folder`);
    assert.equal(`${definition.version}.json`, file, `${where}: version matches its file name`);
    assert.ok(typeof definition.displayName === 'string' && definition.displayName, `${where}: has a name`);
    assert.ok(Array.isArray(definition.operations) && definition.operations.length, `${where}: has operations`);
    const keys = definition.operations.map((operation: { key: string }) => operation.key);
    assert.equal(new Set(keys).size, keys.length, `${where}: operation keys do not repeat`);
    assert.ok(definition.operations.some((operation: { required: boolean }) => operation.required === true), `${where}: at least one required operation`);
    if (definition.choosing !== undefined) assert.ok(Array.isArray(definition.choosing) && definition.choosing.length && definition.choosing.every((way: string) => ['bound', 'dynamic', 'consensus', 'policy'].includes(way)), `${where}: choosing lists bound, dynamic, consensus or policy`);
    for (const operation of definition.operations) {
      assert.match(operation.key, /^[a-z][a-z0-9-]*$/, `${where}: operation ${operation.key}`);
      assert.equal(typeof operation.required, 'boolean', `${where}: ${operation.key} says whether it is required`);
      for (const part of ['input', 'output']) if (operation[part] !== undefined) assert.equal(operation[part].type, 'object', `${where}: ${operation.key} ${part} is a JSON Schema object`);
    }
    count += 1;
  }
}
assert.ok(count >= 2);
console.log(`SEMA capability definitions test passed (${count} definitions).`);
