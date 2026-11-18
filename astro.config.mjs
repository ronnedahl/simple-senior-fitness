import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    icon(),
  ],
  site: 'https://simpleseniorfitness.com',
  trailingSlash: 'never',
  vite: {
    server: {
      // The project lives on the Windows drive (/mnt/c), where WSL gets no
      // file-change events, so the dev server has to poll. Polling checks
      // every watched file each interval, so folders that are not site source
      // are left out: with them the watcher had ~13,000 files to check and
      // edits in src/ were never picked up.
      // src/icons/ must exist (kept with a .gitkeep): astro-icon adds it to the
      // watcher, and when the folder is missing the polling watcher stops
      // watching src/ altogether.
      watch: {
        usePolling: true,
        interval: 300,
        ignored: [
          '**/dist/**',
          '**/bustling-belt/**',
          '**/generated-images/**',
          '**/image-prompts/**',
          '**/scripts/**',
        ],
      },
      hmr: {
        overlay: true,
      },
    },
  },
});
