"use client";

import { useEffect, useState } from "react";
import ProductSectionClient from "@/components/product/product-section-client";
import { getSection } from "@/lib/api/landing-page";

const DEFAULT_TITLE = "Best Sellers";
const DEFAULT_SUBTITLE = "Top seller products of this week";

export default function BestSellers() {
    const [title, setTitle] = useState(DEFAULT_TITLE);
    const [subtitle, setSubtitle] = useState(DEFAULT_SUBTITLE);

    useEffect(() => {
        getSection("home", "best_sellers")
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
            navigationId="best-sellers"
            cardType="vertical"
            viewAllLink="/collections/best-sellers"
            filterTags={["best-seller", "bestseller", "best_seller", "bestsellers", "best-sellers"]}
            sectionClass="w-full bg-gray-50 py-10 dark:bg-gray-900/50 overflow-hidden"
        />
    );
}
