import type { CapabilityManifest } from './types.js';

const key = /^[a-z][a-z0-9.-]{2,127}$/;

/** Validates provider declarations before they enter discovery. */
export function defineCapability(manifest: CapabilityManifest): Readonly<CapabilityManifest> {
  if (!key.test(manifest.capabilityKey)) throw new Error('Capability key must be lowercase dotted or hyphenated text');
  if (!key.test(manifest.providerKey)) throw new Error('Provider key must be lowercase dotted or hyphenated text');
  if (!manifest.operations.length) throw new Error('A capability must expose at least one documented operation');
  const operationKeys = new Set<string>();
  for (const operation of manifest.operations) {
    if (!key.test(operation.key)) throw new Error(`Invalid operation key: ${operation.key}`);
    if (operationKeys.has(operation.key)) throw new Error(`Duplicate operation key: ${operation.key}`);
    operationKeys.add(operation.key);
  }
  return Object.freeze({ ...manifest, executionModes: [...manifest.executionModes], operations: manifest.operations.map((operation) => Object.freeze({ ...operation, input: Object.freeze({ ...operation.input, requiredFields: [...operation.input.requiredFields], optionalFields: [...(operation.input.optionalFields ?? [])] }), output: Object.freeze({ ...operation.output, requiredFields: [...operation.output.requiredFields], optionalFields: [...(operation.output.optionalFields ?? [])] }) })), documentation: Object.freeze({ ...manifest.documentation, useCases: [...manifest.documentation.useCases], limitations: [...manifest.documentation.limitations], changeNotes: [...manifest.documentation.changeNotes] }) });
}

/** Returns documentation suitable for help panels and SeloDoc collection. */
export function describeCapability(manifest: CapabilityManifest) {
  const defined = defineCapability(manifest);
  return {
    capabilityKey: defined.capabilityKey, providerKey: defined.providerKey, version: defined.version,
    summary: defined.documentation.summary, operations: defined.operations.map((operation) => ({ key: operation.key, displayName: operation.displayName, description: operation.description, input: operation.input, output: operation.output, idempotent: operation.idempotent })),
    useCases: defined.documentation.useCases, limitations: defined.documentation.limitations, changeNotes: defined.documentation.changeNotes,
  };
}
