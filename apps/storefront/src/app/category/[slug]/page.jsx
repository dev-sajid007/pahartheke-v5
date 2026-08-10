import Link from "next/link";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { getProductsByCategorySlug, getProducts } from "@/lib/api/products";
import { transformProduct } from "@/lib/transform/productTransform";
import { getCategories } from "@/lib/api/categories";
import CategoryView from "@/components/category/category-view";

export default async function CategoryProductsPage({ params }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug || "";
  const slug = decodeURIComponent(rawSlug);

  let rawProducts = [];
  let categories = [];
  let errorMessage = "";

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      getProductsByCategorySlug(slug).catch(async () => {
        return getProducts();
      }),
      getCategories().catch(() => [])
    ]);

    rawProducts = productsRes;
    categories = categoriesRes;

    if (!rawProducts || rawProducts.length === 0) {
      // Fallback to all products if specific category returns empty
      rawProducts = await getProducts();
    }
  } catch (error) {
    console.error("Category page fetch error:", error);
    try {
      rawProducts = await getProducts();
    } catch (err) {
      errorMessage =
        (typeof err?.message === "string" && err.message)
          ? err.message
          : (typeof error?.message === "string" && error.message)
            ? error.message
            : "Something went wrong while loading products.";
    }
  }

  const products = (rawProducts || []).map(transformProduct);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16 pt-4">
        {errorMessage ? (
          <div className="container mx-auto px-4 py-8">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
              <h2 className="text-lg font-bold text-red-600">Failed to load products</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{errorMessage}</p>
              <Link
                href="/"
                className="mt-4 inline-block rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <CategoryView currentSlug={slug} initialProducts={products} initialCategories={categories} />
        )}
      </main>
      <Footer />
    </>
  );
}
