const CracoLessPlugin = require('craco-less')
const path = require('path')

const libraryDirectory = 'es'
module.exports = {
  babel: {
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }], //装饰器
      [
        'import',
        {
          libraryName: 'antd',
          libraryDirectory: libraryDirectory,
          style: true,
        },
      ],
    ],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#d2568c',
              '@link-color': '#1890ff', // 链接色
              '@success-color': '#52c41a', // 成功色
              '@warning-color': '#faad14', // 警告色
              '@error-color': '#f5222d', // 错误色
              '@font-size-base': '14px', // 主字号
              '@heading-color': 'rgba(0, 0, 0, 0.85)', // 标题色
              '@text-color': 'rgba(0, 0, 0, 0.65)', // 主文本色
              '@text-color-secondary': 'rgba(0, 0, 0, 0.45)', // 次文本色
              '@disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
              '@border-radius-base': '2px', // 组件/浮层圆角
              '@border-color-base': '#d9d9d9', // 边框色
              '@box-shadow-base':
                '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)', // 浮层阴影
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://www.baidu.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@core': path.resolve(__dirname, 'src/components'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
}
