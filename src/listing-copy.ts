/**
 * The rule check of "write listing copy" (sema.listing.write-copy 1.0.0): where a variant breaks the platform's rules.
 * It is plain code, part of the capability, not an AI, so every service and every application checks the same way:
 * a service fills each variant's ruleCheck with it, and an application checks again what a person edited before it
 * publishes. Lengths count characters (code points), as SEMA's schema checker does.
 */
export interface PlatformProfile {
  name: string;
  title: { maxLength: number };
  description: { format: 'plain' | 'html' | 'markdown'; maxLength: number };
  tags?: { count: number; maxLength: number };
  bullets?: { count: number; maxLength: number };
  forbiddenWords?: string[];
}
export interface ListingVariant { title: string; description: string; tags: string[]; bullets?: string[] }
export interface RuleProblem { field: string; problem: string }

const length = (text: string) => [...text].length;
const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function checkListingCopy(variant: ListingVariant, platform: PlatformProfile): RuleProblem[] {
  const problems: RuleProblem[] = [];
  if (!variant.title.trim()) problems.push({ field: 'title', problem: 'The title is empty' });
  if (length(variant.title) > platform.title.maxLength) problems.push({ field: 'title', problem: `The title is ${length(variant.title)} characters; ${platform.name} allows ${platform.title.maxLength}` });
  if (!variant.description.trim()) problems.push({ field: 'description', problem: 'The description is empty' });
  if (length(variant.description) > platform.description.maxLength) problems.push({ field: 'description', problem: `The description is ${length(variant.description)} characters; ${platform.name} allows ${platform.description.maxLength}` });
  if (platform.description.format === 'plain' && /<\/?[a-z][^>]*>/i.test(variant.description)) problems.push({ field: 'description', problem: `${platform.name} takes plain text, and the description contains HTML tags` });
  const tags = platform.tags;
  if (tags) {
    if (variant.tags.length > tags.count) problems.push({ field: 'tags', problem: `There are ${variant.tags.length} tags; ${platform.name} allows ${tags.count}` });
    variant.tags.forEach((tag, index) => { if (length(tag) > tags.maxLength) problems.push({ field: `tags[${index}]`, problem: `"${tag}" is ${length(tag)} characters; ${platform.name} allows ${tags.maxLength}` }); });
    const seen = new Set<string>();
    variant.tags.forEach((tag, index) => { const key = tag.trim().toLowerCase(); if (seen.has(key)) problems.push({ field: `tags[${index}]`, problem: `"${tag}" repeats an earlier tag` }); seen.add(key); });
  } else if (variant.tags.length) problems.push({ field: 'tags', problem: `${platform.name} takes no tags` });
  const bullets = platform.bullets, given = variant.bullets ?? [];
  if (bullets) {
    if (given.length > bullets.count) problems.push({ field: 'bullets', problem: `There are ${given.length} bullet points; ${platform.name} allows ${bullets.count}` });
    given.forEach((bullet, index) => { if (length(bullet) > bullets.maxLength) problems.push({ field: `bullets[${index}]`, problem: `Bullet ${index + 1} is ${length(bullet)} characters; ${platform.name} allows ${bullets.maxLength}` }); });
  } else if (given.length) problems.push({ field: 'bullets', problem: `${platform.name} takes no bullet points` });
  for (const word of platform.forbiddenWords ?? []) {
    if (!word.trim()) continue;
    const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])${escape(word.trim())}($|[^\\p{L}\\p{N}])`, 'iu');
    for (const [field, text] of [['title', variant.title], ['description', variant.description], ...variant.tags.map((tag, index) => [`tags[${index}]`, tag]), ...given.map((bullet, index) => [`bullets[${index}]`, bullet])] as Array<[string, string]>) {
      if (pattern.test(text)) problems.push({ field, problem: `Uses "${word}", which ${platform.name} does not allow` });
    }
  }
  return problems;
}
