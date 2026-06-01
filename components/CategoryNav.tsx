"use client";

import { useEffect, useRef, useState } from "react";
import type { MenuCategory } from "@/types/menu";

export function CategoryNav({ categories }: { categories: MenuCategory[] }) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug);
  const navRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    const nav = navRef.current;
    const activeButton = activeSlug ? buttonRefs.current.get(activeSlug) : null;

    if (!nav || !activeButton) {
      return;
    }

    const styles = window.getComputedStyle(nav);
    const paddingLeft = Number.parseFloat(styles.paddingLeft);
    const paddingRight = Number.parseFloat(styles.paddingRight);
    const buttonLeft = activeButton.offsetLeft;
    const buttonRight = buttonLeft + activeButton.offsetWidth;
    const visibleLeft = nav.scrollLeft + paddingLeft;
    const visibleRight = nav.scrollLeft + nav.clientWidth - paddingRight;

    if (buttonLeft < visibleLeft || buttonRight > visibleRight) {
      nav.scrollTo({
        left:
          buttonLeft + activeButton.offsetWidth / 2 - nav.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, [activeSlug]);

  useEffect(() => {
    const sections = categories
      .map((category) => document.getElementById(category.slug))
      .filter((section): section is HTMLElement => section !== null);
    let frameId: number | undefined;

    const updateActiveCategory = () => {
      frameId = undefined;
      const sectionScrollMargin = sections[0]
        ? Number.parseFloat(window.getComputedStyle(sections[0]).scrollMarginTop)
        : 0;
      const activationLine =
        Math.max(
          navRef.current?.getBoundingClientRect().bottom ?? 0,
          sectionScrollMargin,
        ) + 1;
      const reachedPageEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1;
      const activeSection = reachedPageEnd
        ? sections[sections.length - 1]
        : sections.reduce((active, section) => {
            return section.getBoundingClientRect().top <= activationLine
              ? section
              : active;
          }, sections[0]);

      if (activeSection?.id) {
        setActiveSlug(activeSection.id);
      }
    };

    const requestActiveCategoryUpdate = () => {
      if (frameId === undefined) {
        frameId = window.requestAnimationFrame(updateActiveCategory);
      }
    };

    updateActiveCategory();
    window.addEventListener("scroll", requestActiveCategoryUpdate, {
      passive: true,
    });
    window.addEventListener("resize", requestActiveCategoryUpdate);

    return () => {
      window.removeEventListener("scroll", requestActiveCategoryUpdate);
      window.removeEventListener("resize", requestActiveCategoryUpdate);
      if (frameId !== undefined) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [categories]);

  return (
    <nav ref={navRef} className="category-nav" aria-label="Kategorie menu">
      {categories.map((category) => (
        <button
          key={category._id}
          ref={(button) => {
            if (button) {
              buttonRefs.current.set(category.slug, button);
            } else {
              buttonRefs.current.delete(category.slug);
            }
          }}
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
