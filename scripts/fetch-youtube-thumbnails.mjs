#!/usr/bin/env node
// Downloads the thumbnail of every <YouTubeEmbed videoId="..."> on the site into
// src/assets/images/shared/youtube/<id>.webp, so the click-to-load player can show it
// from our own server. Visitors then never contact YouTube or Google before they press
// play (see YouTubeEmbed.astro). Existing thumbnails are skipped; pass --force to refresh.
//
//   npm run yt-thumbs
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import sharp from 'sharp';

const PAGES_DIR = resolve(process.cwd(), 'src');
const OUT_DIR = resolve(process.cwd(), 'src/assets/images/shared/youtube');
const force = process.argv.includes('--force');

function findVideoIds(dir) {
  const ids = new Set();
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) findVideoIds(path).forEach((id) => ids.add(id));
    else if (entry.name.endsWith('.astro')) {
      for (const m of readFileSync(path, 'utf8').matchAll(/<YouTubeEmbed[^>]*videoId="([\w-]{11})"/g)) ids.add(m[1]);
    }
  }
  return ids;
}

// maxresdefault is a clean 16:9 frame but does not exist for every video; hqdefault
// always exists but is 4:3 with black bars, so it is cropped to 16:9.
async function download(id) {
  for (const [name, crop] of [['maxresdefault', false], ['hqdefault', true]]) {
    const res = await fetch(`https://i.ytimg.com/vi/${id}/${name}.jpg`);
    if (!res.ok) continue;
    let img = sharp(Buffer.from(await res.arrayBuffer()));
    if (crop) {
      const { width, height } = await img.metadata();
      const h = Math.round((width * 9) / 16);
      img = img.extract({ left: 0, top: Math.round((height - h) / 2), width, height: h });
    }
    return img.resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  }
  throw new Error('no thumbnail found');
}

async function main() {
  const ids = [...findVideoIds(PAGES_DIR)];
  mkdirSync(OUT_DIR, { recursive: true });
  console.log(`[yt-thumbs] ${ids.length} video(s) found`);
  let failed = 0;
  for (const id of ids) {
    const out = join(OUT_DIR, `${id}.webp`);
    if (existsSync(out) && !force) {
      console.log(`[yt-thumbs] skip ${id} (exists)`);
      continue;
    }
    try {
      writeFileSync(out, await download(id));
      console.log(`[yt-thumbs] ok   ${id}`);
    } catch (err) {
      failed++;
      console.error(`[yt-thumbs] FAIL ${id}: ${err.message}`);
    }
  }
  if (failed) process.exit(1);
}

main();
