import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'

export default defineConfig(({ command }) => ({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'src',
    }),
    viteReact(),
    // The Netlify adapter only matters when producing the deploy artifact. In
    // dev it boots a Deno edge-functions server, and when that fails to start
    // it takes the whole dev server down with it about a minute in. This site
    // ships no edge functions of its own, so dev has nothing to lose.
    ...(command === 'build' ? [netlify()] : []),
  ],
}))
