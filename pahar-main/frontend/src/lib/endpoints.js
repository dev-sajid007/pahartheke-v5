function requireEnv(name) {
  const val = process.env[name]
  if (!val) throw new Error(`Missing required env variable: ${name}`)
  return val.replace(/\/+$/, '')
}

export function getPosBase() {
  return requireEnv('POS_API_BASE_URL')
}

export function getBackendBase() {
  return requireEnv('BACKEND_API_URL')
}

export const posApi = {
  products: () => `${getPosBase()}/products`,
  product: (slug) => `${getPosBase()}/products/${encodeURIComponent(slug)}`,
  productsByCategory: (slug) => `${getPosBase()}/products?category=${encodeURIComponent(slug)}`,
  categories: () => `${getPosBase()}/categories`,
  orders: () => `${getPosBase()}/orders`,
}

export const authApi = {
  login: () => `${getBackendBase()}/api/auth/login`,
  register: () => `${getBackendBase()}/api/auth/register`,
  me: () => `${getBackendBase()}/api/auth/me`,
  profile: () => `${getBackendBase()}/api/auth/profile`,
}

export const landingApi = {
  page: (pageName) => `${getBackendBase()}/api/landing-page?pageName=${pageName}`,
}

export function getApiKey() {
  return process.env.ECOMMERCE_API_KEY || ''
}

export function posHeaders() {
  const headers = { Accept: 'application/json' }
  const key = getApiKey()
  if (key) headers['x-api-key'] = key
  return headers
}
