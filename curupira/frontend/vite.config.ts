/* eslint-disable @typescript-eslint/no-explicit-any */
import react from '@vitejs/plugin-react-swc'
import { componentTagger } from 'lovable-tagger'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

export default ({ mode }: any) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  const basePath = process.env.VITE_PROXY_SERVER_FOLDER

  return defineConfig({
    server: {
      port: 3000,
    },
    base: basePath,
    plugins: [react(), mode === 'development' && componentTagger()].filter(
      Boolean,
    ),
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
        { find: '~', replacement: path.resolve(__dirname, './src') },
      ],
    },
    build: {
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo: any) => {
            let extType = assetInfo.name.split('.').at(1)
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img'
            }
            return `assets/${extType}/[name]-[hash][extname]`
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
    },
  })
}
