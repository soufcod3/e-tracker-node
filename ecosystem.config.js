module.exports = {
  apps : [{
    script: 'src/index.js',
    watch: '.',
    env: {
      "NODE_ENV": "production"
    }
  }],

  deploy : {
    production : {
      user : 'root',
      host : '89.117.37.18',
      ref  : 'origin/main',
      repo : 'git@github.com:soufcod3/e-tracker-node.git',
      path : '/var/www/e-tracker-node',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && tsc && px pm2 reload ecosystem.config.js && pm2 ls',
      'pre-setup': ''
    }
  }
};
