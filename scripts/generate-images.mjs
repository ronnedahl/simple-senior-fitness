#!/usr/bin/env node
// Bulk-generates the step illustrations in scripts/image-prompts.mjs with the OpenAI Images API.
// Output goes to generated-images/ (gitignored) for review; nothing is written to src/.
//
//   npm run images -- --dry-run                 show what would be generated, no API calls
//   npm run images                              generate everything that does not exist yet
//   npm run images -- --only radio-1-4,seiza-steps --variants 2 --quality high
//   npm run images -- --only radio-1-4 --force  regenerate even if the file exists
//
// Needs OPENAI_API_KEY, either in the environment or in .env (gitignored).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { parseArgs } from 'node:util';
import { STYLE, REFERENCE, IMAGES } from './image-prompts.mjs';

const API = 'https://api.openai.com/v1/images';
const OUT_DIR = resolve(process.cwd(), 'generated-images');
const SIZE = '1536x1024';

const { values: opts } = parseArgs({
  options: {
    only: { type: 'string' },
    variants: { type: 'string', default: '1' },
    quality: { type: 'string', default: 'medium' },
    model: { type: 'string', default: 'gpt-image-2' },
    concurrency: { type: 'string', default: '3' },
    force: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
  },
});

function loadApiKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  try {
    const line = readFileSync(resolve(process.cwd(), '.env'), 'utf8')
      .split('\n')
      .find((l) => l.startsWith('OPENAI_API_KEY='));
    return line?.slice('OPENAI_API_KEY='.length).trim().replace(/^["']|["']$/g, '');
  } catch {
    return undefined;
  }
}

// name.png -> name.v2.png for the second variant
const variantPath = (out, v) => resolve(OUT_DIR, v === 1 ? out : out.replace(/\.png$/, `.v${v}.png`));

async function callApi(endpoint, apiKey, body) {
  const isForm = body instanceof FormData;
  const res = await fetch(`${API}/${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, ...(isForm ? {} : { 'Content-Type': 'application/json' }) },
    body: isForm ? body : JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${json.error?.message ?? res.statusText}`);
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error('response contained no image data');
  return Buffer.from(b64, 'base64');
}

// The reference sheet is generated from text alone; every other image is an edit that
// attaches the reference so the same person carries through the whole set.
async function generate(job, apiKey, referencePng) {
  const prompt = `${STYLE}\n\n${job.prompt}`;
  if (!referencePng) {
    return callApi('generations', apiKey, { model: opts.model, prompt, size: SIZE, quality: opts.quality, n: 1 });
  }
  const form = new FormData();
  form.append('model', opts.model);
  form.append('prompt', `Use the exact same person, clothing and drawing style as in the attached reference image.\n\n${prompt}`);
  form.append('size', SIZE);
  form.append('quality', opts.quality);
  form.append('image', new Blob([referencePng], { type: 'image/png' }), 'reference.png');
  return callApi('edits', apiKey, form);
}

async function runPool(tasks, limit) {
  const results = [];
  let next = 0;
  const worker = async () => {
    while (next < tasks.length) results.push(await tasks[next++]());
  };
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results;
}

async function main() {
  const variants = Number(opts.variants);
  const only = opts.only?.split(',').map((s) => s.trim());
  const unknown = only?.filter((id) => !IMAGES.some((img) => img.id === id));
  if (unknown?.length) {
    console.error(`[images] unknown id(s): ${unknown.join(', ')}. Known: ${IMAGES.map((i) => i.id).join(', ')}`);
    process.exit(1);
  }

  const selected = IMAGES.filter((img) => !only || only.includes(img.id));
  const todo = selected.flatMap((job) =>
    Array.from({ length: variants }, (_, i) => ({ job, path: variantPath(job.out, i + 1) }))
  ).filter(({ path }) => opts.force || !existsSync(path));
  const refPath = resolve(OUT_DIR, REFERENCE.out);
  const needsRef = !existsSync(refPath);

  console.log(`[images] model ${opts.model}, quality ${opts.quality}, size ${SIZE}`);
  if (needsRef) console.log(`[images] reference  -> ${refPath}`);
  for (const { job, path } of todo) console.log(`[images] ${job.id.padEnd(14)} -> ${path}`);
  console.log(`[images] ${todo.length + (needsRef ? 1 : 0)} image(s) to generate`);
  if (opts['dry-run'] || todo.length + (needsRef ? 1 : 0) === 0) return;

  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error('[images] OPENAI_API_KEY is not set (environment or .env)');
    process.exit(1);
  }

  if (needsRef) {
    mkdirSync(dirname(refPath), { recursive: true });
    writeFileSync(refPath, await generate(REFERENCE, apiKey, null));
    console.log(`[images] ok  reference`);
  }
  const referencePng = readFileSync(refPath);

  const results = await runPool(
    todo.map(({ job, path }) => async () => {
      try {
        const png = await generate(job, apiKey, referencePng);
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, png);
        console.log(`[images] ok  ${job.id} -> ${path}`);
        return true;
      } catch (err) {
        console.error(`[images] FAIL ${job.id}: ${err.message}`);
        return false;
      }
    }),
    Number(opts.concurrency)
  );

  const failed = results.filter((ok) => !ok).length;
  console.log(`[images] done: ${results.length - failed} ok, ${failed} failed`);
  if (failed) process.exit(1);
}

main();
