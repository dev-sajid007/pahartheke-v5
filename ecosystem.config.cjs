module.exports = {
  apps: [
    {
      name: "pos-backend",
      cwd: "./apps/pos-api",
      script: "node",
      args: "server.js",
      autorestart: true,
      max_restarts: 10,
      kill_timeout: 5000,
      env: { NODE_ENV: "production" },
    },
    {
      name: "pos-frontend",
      cwd: "./apps/pos",
      script: "node",
      args: "node_modules/next/dist/bin/next start -p 4000",
      autorestart: true,
      max_restarts: 10,
      kill_timeout: 8000,
      env: { NODE_ENV: "production" },
    },
  ],
};
