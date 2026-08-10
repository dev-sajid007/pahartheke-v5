module.exports = {
  apps: [
    { name: 'pos-api', cwd: './apps/pos-api', script: 'server.js', env: { NODE_ENV: 'production' } },
    { name: 'pos', cwd: './apps/pos', script: 'node_modules/next/dist/bin/next', args: 'start -p 7100', env: { NODE_ENV: 'production' } },
    { name: 'mcp', cwd: './apps/mcp', script: 'dist/index.js', env: { NODE_ENV: 'production', PORT: '7102' } },
    { name: 'storefront', cwd: './apps/storefront', script: 'node_modules/next/dist/bin/next', args: 'start -p 7103', env: { NODE_ENV: 'production' } },
    { name: 'admin', cwd: './apps/admin', script: 'node_modules/next/dist/bin/next', args: 'start -p 7104', env: { NODE_ENV: 'production' } },
    { name: 'main-api', cwd: './apps/main-api', script: 'src/server.js', env: { NODE_ENV: 'production', PORT: '7105' } },
  ],
}
