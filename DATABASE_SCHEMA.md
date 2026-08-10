# Database Schema — Pahar POS

MongoDB 7, database: `pahar_pos_v5`, port `27018`. All models live in `apps/pos-api/src/modules/**/*.model.js` and use Mongoose 9 with timestamps.

## Relationship Overview

```
User ──soldBy──► Sale ◄──customer── Customer ◄──badge── Badge
Product ◄──category── Category
Product ◄──product── PurchaseBatch (FIFO stock)
Purchase ──supplier──► Supplier ──► PurchaseCost (cost types)
Sale / Purchase ──► StockMovement (audit log)
Expense ──category──► ExpenseCategory ──createdBy──► User
Settings (singleton)
```

## Collections & Fields

### users — `modules/auth/auth.model.js`

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | required, trimmed |
| `email` | String | required, unique, lowercase, validated |
| `password` | String | required, min 6, bcrypt-hashed on save |
| `role` | String enum | `admin` / `manager` / `cashier` (default `cashier`) |
| `isActive` | Boolean | default `true` |

Methods: `matchPassword(password)`.

### categories — `modules/category/category.model.js`

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | required, unique, trimmed |
| `slug` | String | required, unique |
| `image` | String | default `""` (Cloudinary URL) |
| `status` | Boolean | default `true` |

### products — `modules/product/product.model.js`

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | required, trimmed |
| `sku` | String | unique |
| `barcode` | String | unique, sparse |
| `category` | ObjectId → `Category` | |
| `productType` | String enum | `weight` / `piece` / `packet` / `bundle` (default `piece`) |
| `unit` | String | default `"pcs"` |
| `purchasePrice` | Number | required, default 0 |
| `salePrice` | Number | required, default 0 |
| `currentStock` | Number | default 0; = sum of variant stock when `hasVariants` |
| `minimumStockAlert` | Number | default 5 |
| `slug` | String | unique, sparse |
| `description` | String | default `""` |
| `tags` | [String] | |
| `image` | String | default `""` (Cloudinary URL) |
| `status` | Boolean | default `true` |
| `hasVariants` | Boolean | default `false` |
| `variants` | [Variant] | see below |

**Variant subdocument:**

| Field | Type |
|-------|------|
| `variantId` | String |
| `name` | String |
| `sku` | String |
| `barcode` | String |
| `purchasePrice` | Number |
| `salePrice` | Number |
| `currentStock` | Number (default 0) |

### purchasebatches — `modules/product/purchaseBatch.model.js`

FIFO stock batches, consumed on sale to compute cost of goods.

| Field | Type | Notes |
|-------|------|-------|
| `product` | ObjectId → `Product` | required |
| `variantId` | String | |
| `quantity` | Number | required |
| `remainingQuantity` | Number | required; decremented as sold |
| `purchasePrice` | Number | required |
| `purchaseDate` | Date | default now |

### suppliers — `modules/supplier/supplier.model.js`

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | required, trimmed |
| `phone` | String | required, unique |
| `email` | String | default `""` |
| `address` | String | default `""` |
| `companyName` | String | default `""` |
| `previousDue` | Number | default 0 |
| `totalPurchaseAmount` | Number | default 0 |
| `status` | Boolean | default `true` |

### purchases — `modules/purchase/purchase.model.js`

| Field | Type | Notes |
|-------|------|-------|
| `invoiceNo` | String | unique |
| `supplier` | ObjectId → `Supplier` | |
| `items` | [PurchaseItem] | see below |
| `additionalCosts` | [{ name, amount }] | extra charges |
| `totalAmount` | Number | required |
| `paidAmount` | Number | default 0 |
| `dueAmount` | Number | default 0 |
| `note` | String | default `""` |

**PurchaseItem subdocument** (`_id: false`):

| Field | Type | Notes |
|-------|------|-------|
| `product` | ObjectId → `Product` | required |
| `variantId` | String | default null |
| `quantity` | Number | required |
| `purchasePrice` | Number | required |
| `subtotal` | Number | required |

### purchasecosts — `modules/purchase/purchaseCost.model.js`

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | required, unique, trimmed |
| `description` | String | default `""` |
| `status` | Boolean | default `true` |

### customers — `modules/customer/customer.model.js`

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | required, trimmed |
| `phone` | String | required, unique |
| `email` | String | default `""` |
| `address` | String | default `""` |
| `previousDue` | Number | default 0 |
| `totalSpent` | Number | default 0; updated on sales |
| `totalOrders` | Number | default 0; updated on sales |
| `badge` | ObjectId → `Badge` | assigned loyalty badge |
| `loyaltyPoints` | Number | default 0 |
| `status` | Boolean | default `true` |

### badges — `modules/customer/badge.model.js`

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | required, trimmed |
| `description` | String | trimmed |
| `icon` | String | lucide icon name or image URL; default `"Award"` |
| `discount` | Number | default 0 |
| `conditions` | [Condition] | see below |
| `color` | String | hex, default `#3b82f6` |
| `status` | Boolean | default `true` |

**Condition subdocument:**

| Field | Type | Notes |
|-------|------|-------|
| `field` | String enum | `totalOrders` / `totalSpent` |
| `operator` | String enum | `gt` / `lt` / `gte` / `lte` / `eq` |
| `value` | Number | |

### sales — `modules/sale/sale.model.js`

| Field | Type | Notes |
|-------|------|-------|
| `invoiceNo` | String | unique |
| `externalOrderId` | String | unique, sparse; idempotency key for website orders |
| `customer` | ObjectId → `Customer` | |
| `customerName` | String | snapshot (denormalized) |
| `customerPhone` | String | snapshot |
| `customerEmail` | String | snapshot |
| `customerAddress` | String | snapshot |
| `customerCity` | String | snapshot |
| `paymentType` | String | default `cash_on_delivery` |
| `items` | [SaleItem] | see below |
| `subtotal` | Number | required |
| `shippingCost` | Number | default 0 |
| `discount` | Number | default 0 |
| `badgeName` | String | loyalty badge applied |
| `badgeDiscount` | Number | default 0 |
| `grandTotal` | Number | required |
| `paidAmount` | Number | default 0 |
| `dueAmount` | Number | default 0 |
| `totalCost` | Number | required; from FIFO batches |
| `totalProfit` | Number | required; `grandTotal - totalCost` |
| `source` | String enum | `pos` / `website` (default `pos`) |
| `note` | String | default `""` |
| `soldBy` | ObjectId → `User` | cashier |
| `order_date` | Date | default now |

**SaleItem subdocument** (`_id: false`):

| Field | Type | Notes |
|-------|------|-------|
| `product` | ObjectId → `Product` | required |
| `variantId` | String | |
| `variantName` | String | |
| `quantity` | Number | required |
| `salePrice` | Number | required |
| `itemDiscountType` | String enum | `None` / `Percentage` / `Fixed` (default `None`) |
| `itemDiscount` | Number | default 0 |
| `subtotal` | Number | required |
| `cost` | Number | required; FIFO cost |
| `profit` | Number | required |

### stockmovements — `modules/stock/stockMovement.model.js`

| Field | Type | Notes |
|-------|------|-------|
| `product` | ObjectId → `Product` | required |
| `variantId` | String | |
| `type` | String enum | `purchase` / `sale` / `adjustment` / `damage` / `return` |
| `quantity` | Number | required |
| `previousStock` | Number | required |
| `newStock` | Number | required |
| `note` | String | default `""` |
| `referenceId` | ObjectId | generic ref to Sale/Purchase |
| `createdBy` | ObjectId → `User` | |

### expenses — `modules/expense/expense.model.js`

| Field | Type | Notes |
|-------|------|-------|
| `title` | String | required |
| `category` | ObjectId → `ExpenseCategory` | |
| `amount` | Number | required |
| `date` | Date | default now |
| `paymentMethod` | String enum | `Cash` / `Bank` / `Card` (default `Cash`) |
| `reference` | String | default `""` |
| `note` | String | default `""` |
| `createdBy` | ObjectId → `User` | |

### expensecategories — `modules/expenseCategory/expenseCategory.model.js`

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | required, unique, trimmed |
| `slug` | String | required, unique |
| `description` | String | default `""` |
| `status` | Boolean | default `true` |

### settings — `modules/settings/settings.model.js`

Singleton store configuration (one document).

| Field | Type | Notes |
|-------|------|-------|
| `storeName` | String | default `"PAHAR POS"` |
| `contactPhone` | String | |
| `storeAddress` | String | |
| `invoicePrefix` | String | default `"INV-"` |
| `taxRate` | Number | default 0 |
| `invoiceFooterMessage` | String | receipt footer |
| `logo` | String | Cloudinary URL |

## Key Business Rules

- **FIFO costing:** Purchases create `PurchaseBatch` rows; each sale consumes batches oldest-first and records per-item `cost` and `profit`.
- **Stock recalculation:** When a product has variants, `currentStock` is the sum of variant `currentStock`.
- **Loyalty:** `Customer.totalSpent` / `totalOrders` feed `Badge.conditions`; badges grant a `discount` applied on sales.
- **Denormalized snapshots:** Sales copy customer name/phone/address and badge name so historical invoices survive customer edits.
- **Audit trail:** Every stock change writes a `StockMovement` with before/after quantities.
- **Ecommerce:** Sales created from the public website set `source: "website"` and use COD (`paymentType: cash_on_delivery`).
