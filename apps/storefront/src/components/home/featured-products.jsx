"use client";

import { useEffect, useState } from "react";
import ProductSectionClient from "@/components/product/product-section-client";
import { getSection } from "@/lib/api/landing-page";

const DEFAULT_TITLE = "Featured Products";
const DEFAULT_SUBTITLE = "Handpicked select items this week";

export default function FeaturedProducts() {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [subtitle, setSubtitle] = useState(DEFAULT_SUBTITLE);

  useEffect(() => {
    getSection("home", "featured_products")
      .then((s) => {
        if (s) {
          setTitle(s.title || DEFAULT_TITLE);
          setSubtitle(s.subtitle || DEFAULT_SUBTITLE);
        }
      })
      .catch(() => { });
  }, []);

  return (
    <ProductSectionClient
      title={title}
      subtitle={subtitle}
      navigationId="featured"
      cardType="vertical"
      viewAllLink="/collections/featured-products"
      filterTags={["featured", "featured-product", "featured-item", "featured-products"]}
      useFeatured={true}
    />
  );
}
