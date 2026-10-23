"use client";

import CategorySection from "./CategorySection";
import CtaSection from "./CtaSection";
import { type HomeSection } from "@/services/home.service";
import { CategoryProductsPlaceholder, CtaPlaceholder } from "./StorefrontEmptyState";

interface HomePageProps {
  sections: HomeSection[];
}

export default function HomePage({ sections }: HomePageProps) {
  if (!sections || sections.length === 0) {
    return (
      <div className="space-y-12 py-8">
        <CategoryProductsPlaceholder />
        <CtaPlaceholder />
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8">
      {!sections.some((section) => section.type === "category_section") && <CategoryProductsPlaceholder />}
      {sections.map((section, index) => {
        if (section.type === "category_section") {
          return (
            <CategorySection
              key={`cat-${section.category.id}-${index}`}
              category={section.category}
              products={section.products}
            />
          );
        }
        if (section.type === "cta_section") {
          return (
            <CtaSection
              key={`cta-${section.id}-${index}`}
              cta={section}
            />
          );
        }
        return null;
      })}
      {!sections.some((section) => section.type === "cta_section") && <CtaPlaceholder />}
    </div>
  );
}
