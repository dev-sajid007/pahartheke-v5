export const config = {
  site: {
    name: 'Pahar Theke',
    description: 'Your trusted online shopping destination',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 10000,
  },
  auth: {
    providers: ['google', 'facebook', 'email'],
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
  },
  payment: {
    currencies: ['BDT', 'USD', 'EUR'],
    defaultCurrency: 'BDT',
    methods: ['cash', 'bkash', 'nagad', 'card'],
  },
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  pagination: {
    defaultLimit: 12,
    maxLimit: 100,
  },
}