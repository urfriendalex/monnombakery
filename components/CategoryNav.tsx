"use client";

import { useEffect, useState } from "react";
import type { MenuCategory } from "@/types/menu";

export function CategoryNav({ categories }: { categories: MenuCategory[] }) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug);

  useEffect(() => {
    const sections = categories
      .map((category) => document.getElementById(category.slug))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSlug(visible.target.id);
        }
      },
      { rootMargin: "-22% 0px -62% 0px", threshold: [0.1, 0.45, 0.8] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [categories]);

  return (
    <nav className="category-nav" aria-label="Kategorie menu">
      {categories.map((category) => (
        <button
          key={category._id}
          className="category-link"
          type="button"
          aria-current={activeSlug === category.slug}
          onClick={() => {
            document.getElementById(category.slug)?.scrollIntoView({
              block: "start",
              behavior: "smooth",
            });
            setActiveSlug(category.slug);
          }}
        >
          {category.title}
        </button>
      ))}
    </nav>
  );
}
