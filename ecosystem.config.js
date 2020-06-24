module.exports = {
  apps : [
    {
      name: 'Medical Service',
      script: './bin/www',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      autorestart: true,
      exp_backoff_restart_delay: 100,
      watch: false,
      env: {
        NODE_ENV: 'produccion'
      },
      env_local: {
        NODE_ENV: 'local'
      },
      env_desarrollo: {
        NODE_ENV: 'desarrollo'
      },
      env_produccion: {
        NODE_ENV: 'produccion'
      }
    }
  ],

  
};
