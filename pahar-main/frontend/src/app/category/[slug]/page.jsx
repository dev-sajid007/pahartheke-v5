import Link from "next/link";
import { getProductsByCategorySlug } from "@/lib/api/products";
import ProductCard from "@/components/product/product-card";

export default async function CategoryProductsPage({ params }) {
  const slug = params?.slug;
  let products = [];
  let errorMessage = "";

  try {
    products = await getProductsByCategorySlug(slug);
  } catch (error) {
    errorMessage =
      error?.message || "Something went wrong while loading products.";
  }

  if (errorMessage) {
    return (
      <main className="container mx-auto px-4 py-10">
        <div className="rounded-xl border bg-white p-8 text-center dark:border-border dark:bg-card">
          <h1 className="text-xl font-semibold text-red-600">
            Failed to load products
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-muted-foreground">
            {errorMessage}
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-white"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  if (!products.length) {
    return (
      <main className="container mx-auto px-4 py-10">
        <div className="rounded-xl border bg-white p-8 text-center dark:border-border dark:bg-card">
          <h1 className="text-xl font-semibold text-[#2b2b2b] dark:text-white">
            No products found
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-muted-foreground">
            No products are available in this category right now.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-white"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold capitalize text-[#2b2b2b] dark:text-white">
          {slug.replace(/-/g, " ")}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-muted-foreground">
          Browse products from this category.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}