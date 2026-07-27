import Link from "next/link";
import { getProductsByCategorySlug } from "@/services/products";
import { getCategories } from "@/services/categories";
import { transformProduct } from "@/lib/transform/productTransform";
import ProductCard from "@/components/product/product-card";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

export default async function CategoryProductsPage({ params }) {
  const { slug } = await params;
  let products = [];
  let errorMessage = "";
  let categoryName = slug.replace(/-/g, " ");

  try {
    const [fetchedProducts, categories] = await Promise.all([
      getProductsByCategorySlug(slug),
      getCategories(),
    ]);
    products = fetchedProducts.map(transformProduct);

    const cat = categories.find(
      (c) => c.slug === slug || c.name?.toLowerCase().replace(/\s+/g, "-") === slug
    );
    if (cat?.name) categoryName = cat.name;
  } catch (error) {
    errorMessage =
      error?.message || "Something went wrong while loading products.";
  }

  if (errorMessage) {
    return (
      <>
        <Header />
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
        <Footer />
      </>
    );
  }

  if (!products.length) {
    return (
      <>
        <Header />
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
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold capitalize text-[#2b2b2b] dark:text-white">
            {categoryName}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-muted-foreground">
            Browse products from this category.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
