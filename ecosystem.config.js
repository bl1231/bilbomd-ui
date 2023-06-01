module.exports = {
  apps: [
    {
      name: 'BilboMD',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: 'dist',
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html'
      },
      env_production: {
        NODE_ENV: 'production',
        PM2_SERVE_PORT: 3001
      },
      env_development: {
        NODE_ENV: 'development',
        PM2_SERVE_PORT: 3003
      }
    }
  ],

  deploy: {
    production: {
      user: 'webadmin',
      host: 'hyperion',
      ref: 'origin/main',
      repo: 'git@github.com-bilbomd-ui:bl1231/bilbomd-ui.git',
      path: '/bilbomd',
      'pre-deploy-local': '',
      'post-setup': 'npm install && npm run build',
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },
    development: {
      user: 'webadmin',
      host: 'hyperion',
      ref: 'origin/126-migrate-to-vite',
      repo: 'git@github.com-bilbomd-ui:bl1231/bilbomd-ui.git',
      path: '/bilbomd',
      'pre-deploy-local': '',
      'post-setup': 'npm install && npm run build',
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env development',
      'pre-setup': ''
    }
  }
}
