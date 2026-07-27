# API Documentation

## POS API (`apps/pos-api`) — 58 endpoints

Base URL: `http://localhost:4001/api`

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register POS user |
| POST | `/api/auth/login` | No | Login (returns JWT) |
| GET | `/api/auth/profile` | JWT | Get profile |

### Products (`/api/products`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | JWT | List products |
| POST | `/api/products` | JWT | Create product |
| GET | `/api/products/:id` | JWT | Get product |
| PUT | `/api/products/:id` | JWT | Update product |

### Categories (`/api/categories`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | JWT | List categories |
| POST | `/api/categories` | JWT | Create category |
| GET | `/api/categories/:id` | JWT | Get category |
| PUT | `/api/categories/:id` | JWT | Update category |

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
| GET | `/api/suppliers/:id` | JWT | Get supplier |
| PUT | `/api/suppliers/:id` | JWT | Update supplier |
| DELETE | `/api/suppliers/:id` | JWT | Delete supplier |

### Purchases (`/api/purchases`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/purchases` | JWT | List purchases |
| POST | `/api/purchases` | JWT | Create purchase |
| GET | `/api/purchases/:id` | JWT | Get purchase |

### Purchase Costs (`/api/purchase-costs`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/purchase-costs` | JWT | List costs |
| POST | `/api/purchase-costs` | JWT | Create cost |
| GET | `/api/purchase-costs/:id` | JWT | Get cost |
| PUT | `/api/purchase-costs/:id` | JWT | Update cost |

### Sales (`/api/sales`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/sales` | JWT | List sales |
| POST | `/api/sales` | JWT | Create sale |
| GET | `/api/sales/:id` | JWT | Get sale |
| PUT | `/api/sales/:id` | JWT | Update sale |

### Stock (`/api/stock`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/stock` | JWT | Stock levels |
| GET | `/api/stock/movements` | JWT | Stock movement history |

### Expenses (`/api/expenses`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/expenses` | JWT | List expenses |
| POST | `/api/expenses` | JWT | Create expense |
| GET | `/api/expenses/:id` | JWT | Get expense |
| PUT | `/api/expenses/:id` | JWT | Update expense |
| DELETE | `/api/expenses/:id` | JWT | Delete expense |

### Expense Categories (`/api/expense-categories`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/expense-categories` | JWT | List expense categories |
| POST | `/api/expense-categories` | JWT | Create expense category |
| PUT | `/api/expense-categories/:id` | JWT | Update expense category |
| DELETE | `/api/expense-categories/:id` | JWT | Delete expense category |

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
| GET | `/api/reports/daily-sales` | JWT | Daily sales report |
| GET | `/api/reports/product-sales` | JWT | Product-wise sales |
| GET | `/api/reports/cogs` | JWT | Cost of goods sold |
| GET | `/api/reports/profit` | JWT | Gross profit |
| GET | `/api/reports/returns` | JWT | Returns report |
| GET | `/api/reports/expenses` | JWT | Expenses report |

### Ecommerce (Public)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/ecommerce/products` | API Key | List products for storefront |
| GET | `/api/ecommerce/products/:id` | API Key | Get product (by id or slug) |
| GET | `/api/ecommerce/categories` | API Key | List categories |
| POST | `/api/ecommerce/orders` | API Key | Create order |

### Invoice

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/invoices/:id/pdf` | JWT | Generate PDF invoice |

---

## Auth

### JWT Authentication
- Send as `Authorization: Bearer <token>` header
- Token contains: `{ id, role }`

### API Key Authentication
- POS ecommerce endpoints use `x-api-key` header

### Role-Based Access
- `admin` — full access
- `staff` — limited POS operations
- `manager` — management operations
