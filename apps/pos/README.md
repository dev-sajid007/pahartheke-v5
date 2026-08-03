# Pahar POS — Dashboard (Next.js)

Point-of-Sale and Inventory Management dashboard for **Pahartheke.com**. Built with Next.js 16 + React 19.

## Quick Start

```bash
pnpm install
pnpm run dev    # http://localhost:4000
```

Requires the POS backend running on port 4001 and MongoDB.

## Pages

| Route | Page |
|-------|------|
| `/login` | Authentication |
| `/` | POS Terminal (Product Grid + Cart) |
| `/products` | Product list |
| `/products/new` | Create product |
| `/products/edit/[id]` | Edit product |
| `/categories` | Category management |
| `/customers` | Customer management |
| `/badges` | Loyalty badge management |
| `/suppliers` | Supplier management |
| `/purchases` | Purchase list |
| `/purchases/new` | Create purchase |
| `/purchases/costs` | Purchase costs |
| `/purchases/view/[id]` | Purchase detail |
| `/sales` | POS sales list |
| `/sales/history` | Sales history |
| `/sales/view/[id]` | Sale detail |
| `/stock` | Stock levels & movements |
| `/expenses` | Expense tracking |
| `/reports/daily-sales` | Daily sales report |
| `/reports/product-sales` | Product-wise sales |
| `/reports/cogs` | Cost of goods sold |
| `/reports/profit` | Gross profit |
| `/reports/returns` | Returns report |
| `/reports/expenses` | Expenses report |
| `/settings` | System settings |

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Modals:** Custom modal components per entity

## Project Structure

```
pos/
├── next.config.mjs
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   ├── globals.css
│   │   ├── (auth)/login/page.js
│   │   └── (dashboard)/
│   │       ├── layout.js         # Sidebar + header shell
│   │       ├── page.js           # POS terminal
│   │       └── ...page.js        # 20+ feature pages
│   ├── components/
│   │   ├── layout/               # Header, Sidebar, ProtectedRoute
│   │   ├── pos/                  # CartPanel, ProductGrid, VariantSelector
│   │   ├── products/             # ProductModal
│   │   ├── categories/           # CategoryModal
│   │   ├── customers/            # CustomerModal, BadgeModal
│   │   ├── suppliers/            # SupplierModal
│   │   ├── expenses/             # ExpenseModal
│   │   └── ui/                   # SearchableSelect
│   └── lib/
│       └── axios.js              # Axios instance with base URL + interceptors
```

## Environment

```
PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:4001/api
```

`PORT` is read from `.env` (or `.env.local`) by `scripts/run.mjs` and passed to `next dev`/`next start`, since Next.js cannot read `PORT` from `.env` itself. Defaults to `4000` when unset.

## Dependencies

- `next` 16, `react` 19, `react-dom` 19
- `axios` — HTTP client
- `lucide-react` — icons
- `tailwindcss` 4 — styling
