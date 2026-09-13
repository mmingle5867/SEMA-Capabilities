import assert from 'node:assert/strict';
import { defineCapability, describeCapability } from '../src/index.js';
const graphics = defineCapability({
  capabilityKey: 'graphics.vector-trace', displayName: 'Vector Trace', description: 'Creates vector candidates from a raster.', providerKey: 'vectorforge.graphics', version: '0.1.0', status: 'ACTIVE', executionModes: ['LOCAL'],
  operations: [{ key: 'trace-raster', displayName: 'Trace Raster', description: 'Creates an SVG candidate.', input: { name: 'RasterInput', description: 'A prepared raster.', requiredFields: ['assetVersionId'] }, output: { name: 'VectorOutput', description: 'A trace candidate.', requiredFields: ['candidateAssetVersionId'] }, idempotent: false }],
  documentation: { summary: 'VectorForge local graphics provider.', useCases: ['Artwork vectorization'], limitations: ['Provider-specific image support'], changeNotes: ['Reference test manifest.'] },
});
assert.equal(describeCapability(graphics).operations[0]?.key, 'trace-raster');
assert.throws(() => defineCapability({ ...graphics, operations: [] }));
console.log('SEMA Capabilities tests passed.');
