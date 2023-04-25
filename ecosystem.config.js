module.exports = {
  apps: [
    {
      name: 'BilboMD',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: 'build',
        PM2_SERVE_PORT: 3001,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      env_development: {
        NODE_ENV: 'development'
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
    }
  }
}
