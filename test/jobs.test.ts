import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import * as code from '../src/index.js';

// Job definitions (D-173): one folder per job, one file per published version. Each names its facts, the answer's
// shape (sent with every call to sema.ai.generate) and its checks, whose code must exist here.
const root = new URL('../jobs/', import.meta.url);
let count = 0;
for (const folder of readdirSync(root)) {
  assert.match(folder, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${folder}: a job key`);
  for (const file of readdirSync(new URL(`${folder}/`, root))) {
    const where = `${folder}/${file}`;
    assert.match(file, /^\d+\.\d+\.json$/, `${where}: named by its version`);
    const job = JSON.parse(readFileSync(new URL(where, root), 'utf8'));
    assert.equal(job.jobKey, folder, `${where}: key matches its folder`);
    assert.equal(`${job.version}.json`, file, `${where}: version matches its file name`);
    for (const part of ['facts', 'answerShape']) assert.equal(job[part]?.type, 'object', `${where}: ${part} is an object schema`);
    for (const check of job.checks ?? []) assert.equal(typeof (code as Record<string, unknown>)[check.code], 'function', `${where}: check ${check.key} has its code (${check.code})`);
    count += 1;
  }
}
assert.ok(count >= 1);
console.log(`SEMA job definitions test passed (${count} job${count === 1 ? '' : 's'}).`);
