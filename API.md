# API Documentation

## POS API (`apps/pos-api`) — 58 endpoints

Base URL: `http://localhost:4001/api`

Image uploads (products, categories, settings logo) are accepted via `multipart/form-data` with a `image` field and uploaded to Cloudinary (2 MB limit; JPEG, PNG, WEBP).

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register POS user |
| POST | `/api/auth/login` | No | Login (returns JWT, 30-day expiry) |
| GET | `/api/auth/me` | JWT | Get profile |

### Debug (`/api/test`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/test/admin-only` | JWT (admin) | Leftover test route — not used by the app |

### Categories (`/api/categories`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | No | List categories |
| POST | `/api/categories` | JWT (admin, manager) | Create category |
| PUT | `/api/categories/:id` | JWT (admin, manager) | Update category |
| DELETE | `/api/categories/:id` | JWT (admin, manager) | Delete category |

### Products (`/api/products`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | No | List products |
| GET | `/api/products/:id` | No | Get product (by id or slug) |
| POST | `/api/products` | JWT (admin, manager) | Create product |
| PUT | `/api/products/:id` | JWT (admin, manager) | Update product |
| DELETE | `/api/products/:id` | JWT (admin, manager) | Delete product |

### Customers (`/api/customers`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/customers` | JWT | List customers |
| POST | `/api/customers` | JWT | Create customer |
| GET | `/api/customers/:id` | JWT | Get customer |
| PUT | `/api/customers/:id` | JWT | Update customer |
| DELETE | `/api/customers/:id` | JWT | Delete customer |

### Badges (`/api/badges`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/badges` | JWT | List badges |
| POST | `/api/badges` | JWT | Create badge |
| PUT | `/api/badges/:id` | JWT | Update badge |
| DELETE | `/api/badges/:id` | JWT | Delete badge |

### Suppliers (`/api/suppliers`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/suppliers` | JWT | List suppliers |
| POST | `/api/suppliers` | JWT | Create supplier |
| PUT | `/api/suppliers/:id` | JWT | Update supplier |
| DELETE | `/api/suppliers/:id` | JWT | Delete supplier |

### Purchases (`/api/purchases`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/purchases` | JWT | List purchases |
| POST | `/api/purchases` | JWT (admin, manager) | Create purchase |
| GET | `/api/purchases/:id` | JWT | Get purchase |

### Purchase Costs (`/api/purchase-costs`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/purchase-costs` | JWT | List costs |
| POST | `/api/purchase-costs` | JWT (admin, manager) | Create cost |
| PUT | `/api/purchase-costs/:id` | JWT (admin, manager) | Update cost |
| DELETE | `/api/purchase-costs/:id` | JWT (admin, manager) | Delete cost |

### Sales (`/api/sales`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/sales` | JWT | List sales |
| POST | `/api/sales` | JWT | Create sale |
| GET | `/api/sales/:id` | JWT | Get sale |

### Stock (`/api/stock`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/stock/movements` | JWT | Stock movement history |

### Expenses (`/api/expenses`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/expenses` | JWT | List expenses |
| POST | `/api/expenses` | JWT | Create expense |
| PUT | `/api/expenses/:id` | JWT | Update expense |
| DELETE | `/api/expenses/:id` | JWT | Delete expense |

### Expense Categories (`/api/expense-categories`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/expense-categories` | JWT | List expense categories |
| POST | `/api/expense-categories` | JWT (admin, manager) | Create expense category |
| PUT | `/api/expense-categories/:id` | JWT (admin, manager) | Update expense category |
| DELETE | `/api/expense-categories/:id` | JWT (admin, manager) | Delete expense category |

### Settings (`/api/settings`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/settings` | JWT | Get settings |
| PUT | `/api/settings` | JWT | Update settings |

### Dashboard (`/api/dashboard`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/stats` | JWT | Dashboard KPIs |

### Reports (`/api/reports`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/reports/daily-sales` | JWT | Daily sales report (`?date=` or `?startDate&endDate`) |
| GET | `/api/reports/product-wise-sales` | JWT | Product-wise sales (`?startDate&endDate&productId`) |
| GET | `/api/reports/gross-profit` | JWT | Gross profit (`?startDate&endDate`) |
| GET | `/api/reports/cogs` | JWT | Cost of goods sold (`?startDate&endDate`) |
| GET | `/api/reports/returns` | JWT | Returns report (placeholder — returns `[]`) |
| GET | `/api/reports/expenses` | JWT | Expenses report (`?startDate&endDate`) |

### Ecommerce (Public)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/ecommerce/products` | API Key | List products for storefront |
| GET | `/api/ecommerce/products/:id` | API Key | Get product (by id or slug) |
| GET | `/api/ecommerce/categories` | API Key | List categories |
| POST | `/api/ecommerce/orders` | API Key | Create order. Body: `externalOrderId` (required, unique idempotency key), `items[]` (`product`, `variantId`, `variantName`, `quantity`, `salePrice`), `customerInfo` (`name`, `phone`, `email`, `address`, `city`), `note`, `payment_type`, `payment_status`, `discount`, `shippingCost`. Creates a website Sale (`source: "website"`), updates/creates the Customer, decrements stock, and writes StockMovements |

### Invoice

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/invoices/:id/pdf` | JWT | Generate PDF invoice |

---

## Auth

### JWT Authentication
- Send as `Authorization: Bearer <token>` header
- Token contains: `{ id, role }`, expires in 30 days

### API Key Authentication
- POS ecommerce endpoints use `x-api-key` header

### Role-Based Access
- `admin` — full access
- `manager` — management operations (products, categories, purchases, purchase costs, expense categories)
- `cashier` — limited POS operations (sales, customers, suppliers, expenses)
