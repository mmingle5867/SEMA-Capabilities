import assert from 'node:assert/strict';
import { checkListingCopy, type PlatformProfile } from '../src/index.js';

// The rule check of write listing copy: plain code, the same for every service and application.
const etsy: PlatformProfile = { name: 'Etsy', title: { maxLength: 20 }, description: { format: 'plain', maxLength: 50 }, tags: { count: 2, maxLength: 10 }, forbiddenWords: ['best', 'free shipping'] };
assert.deepEqual(checkListingCopy({ title: 'Blue mug', description: 'A blue mug.', tags: ['mug', 'blue'] }, etsy), [], 'a variant within the rules has no problems');
assert.deepEqual(checkListingCopy({ title: 'The best blue coffee mug', description: '<b>Free shipping</b> on this mug, with free shipping', tags: ['mug', 'Mug', 'ceramic-cups'], bullets: ['x'] }, etsy).map((problem) => `${problem.field}: ${problem.problem}`), [
  'title: The title is 24 characters; Etsy allows 20',
  'description: The description is 52 characters; Etsy allows 50',
  'description: Etsy takes plain text, and the description contains HTML tags',
  'tags: There are 3 tags; Etsy allows 2',
  'tags[2]: "ceramic-cups" is 12 characters; Etsy allows 10',
  'tags[1]: "Mug" repeats an earlier tag',
  'bullets: Etsy takes no bullet points',
  'title: Uses "best", which Etsy does not allow',
  'description: Uses "free shipping", which Etsy does not allow',
]);
assert.deepEqual(checkListingCopy({ title: 'Bestseller mug', description: 'ok', tags: [] }, etsy), [], 'a forbidden word inside another word is not a match');
assert.deepEqual(checkListingCopy({ title: '😀'.repeat(20), description: 'ok', tags: [] }, etsy), [], 'lengths count characters');
assert.deepEqual(checkListingCopy({ title: ' ', description: '', tags: [] }, etsy).map((problem) => problem.problem), ['The title is empty', 'The description is empty']);
console.log('Listing copy rule check test passed.');
