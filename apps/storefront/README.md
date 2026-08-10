This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

## Folder Structure
```bash
paharTheke V0.2/
├── .gitignore
├── README.md
├── components.json
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   ├── window.svg
│   ├── videos
│   │   └── HeroSectionVideo.mp4
│   └── images
│       ├── cat
│       │   ├── beef.jpeg
│       │   ├── general.jpeg
│       │   ├── mutton.jpeg
│       │   ├── poultrys.jpeg
│       │   └── spice.jpeg
│       └── frontand
│           ├── TheamImage.jpg
│           └── sectionBanner.jpg
└── src
    ├── app
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.js
    │   ├── page.js
    │   ├── api
    │   │   ├── orders.js
    │   │   ├── categories
    │   │   │   └── route.js
    │   │   ├── orders
    │   │   │   └── route.js
    │   │   └── products
    │   │       ├── route.js
    │   │       └── [slug]
    │   │           └── route.js
    │   ├── checkout
    │   │   └── page.jsx
    │   ├── invest
    │   │   └── page.jsx
    │   ├── category
    │   │   └── [slug]
    │   │       └── page.jsx
    │   └── products
    │       └── [id]
    │           └── page.jsx
    ├── lib
    │   ├── data.js
    │   ├── store.js
    │   ├── utils.js
    │   ├── adapters
    │   │   ├── categoryAdapter.js
    │   │   ├── orderAdapter.js
    │   │   └── productAdapter.js
    │   ├── api
    │   │   ├── categories.js
    │   │   ├── client.js
    │   │   ├── note.txt
    │   │   ├── orders.js
    │   │   ├── products.js
    │   │   └── mappers
    │   │       └── order.js
    │   └── transform
    │       ├── cat-note.txt
    │       ├── category.js
    │       └── productTransform.js
    ├── components
    │   ├── cart
    │   │   └── cart-sheet.jsx
    │   ├── common
    │   │   ├── footer.jsx
    │   │   ├── header.jsx
    │   │   ├── section-title.jsx
    │   │   └── theme-toggle.jsx
    │   ├── home
    │   │   ├── about.jsx
    │   │   ├── affeliate-banner.jsx
    │   │   ├── category-section.jsx
    │   │   ├── customar-review.jsx
    │   │   ├── featured-products.jsx
    │   │   ├── hero-section.jsx
    │   │   ├── invest-banner.jsx
    │   │   └── promo-banner.jsx
    │   ├── product
    │   │   ├── FeaturedProductsWrapper.jsx
    │   │   ├── product-card.jsx
    │   │   ├── product-details-view.jsx
    │   │   └── product-slider.jsx
    │   ├── providers
    │   │   ├── store-provider.jsx
    │   │   └── theme-provider.jsx
    │   └── ui
    │       ├── badge.jsx
    │       ├── button.jsx
    │       ├── card.jsx
    │       ├── dialog.jsx
    │       ├── dropdown-menu.jsx
    │       ├── input.jsx
    │       ├── separator.jsx
    │       ├── sheet.jsx
    │       ├── skeleton.jsx
    │       └── tabs.jsx
    └── features
        └── cart
            └── cartSlice.js
```

First, run the development server:

```bash
#node -v 11.8.0
npm install
#packages installing now
npm run dev
```

## Live On Pahartheke.com subdomain
https://v02.pahartheke.com