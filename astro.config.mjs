// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// Inline ALL stylesheets so they live as <style> tags in the emitted HTML.
// The encrypt-payload pipeline (src/scripts/encrypt-payload.mjs) hoists
// <style> tags out of the protected page's <head> and embeds them into the
// encrypted body payload — but it does NOT follow <link rel="stylesheet">.
// With Astro's default ('auto'), once total component CSS crosses ~4KB it
// gets extracted to /_astro/*.css and linked, which silently breaks the
// gate's innerHTML decrypt-and-replace flow.
export default defineConfig({
  build: {
    inlineStylesheets: 'always',
  },
});
