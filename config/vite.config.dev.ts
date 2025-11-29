import { loadEnv, mergeConfig } from 'vite'
import eslint from 'vite-plugin-eslint'
import baseConfig from './vite.config.base'

export default ({ mode }) => {
  // 加载 env 文件
  const env = loadEnv(mode, process.cwd())
  console.log('VITE_PORT:', env.VITE_PORT)

  return mergeConfig(
    {
      mode,
      server: {
        open: true,
        host: '0.0.0.0',
        port: Number(env.VITE_PORT) || 5173,
        strictPort: true,
      },
      plugins: [
        eslint({
          cache: false,
          include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
          exclude: ['node_modules'],
        }),
      ],
    },
    baseConfig
  )
}
