"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ui, type Locale } from "@/lib/i18n";
import type { MenuCategory, MenuGroup } from "@/types/menu";

export function CategoryNav({
  groups,
  categories,
  locale,
}: {
  groups: MenuGroup[];
  categories: MenuCategory[];
  locale: Locale;
}) {
  const orderedCategories = useMemo(
    () =>
      groups.flatMap((group) =>
        categories.filter((category) => category.group._ref === group._id),
      ),
    [categories, groups],
  );
  const [activeSlug, setActiveSlug] = useState(orderedCategories[0]?.slug);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const categoryNavRef = useRef<HTMLElement>(null);
  const categoryButtonRefs = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    const nav = categoryNavRef.current;
    const button = activeSlug
      ? categoryButtonRefs.current.get(activeSlug)
      : undefined;

    if (!nav || !button) return;

    const left = button.offsetLeft;
    const right = left + button.offsetWidth;
    const visibleLeft = nav.scrollLeft;
    const visibleRight = visibleLeft + nav.clientWidth;

    if (left < visibleLeft || right > visibleRight) {
      nav.scrollTo({
        left: left + button.offsetWidth / 2 - nav.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, [activeSlug]);

  useEffect(() => {
    const groupSections = groups
      .map((group) => document.getElementById(group.slug))
      .filter((section): section is HTMLElement => section !== null);
    const categorySections = orderedCategories
      .map((category) => document.getElementById(category.slug))
      .filter((section): section is HTMLElement => section !== null);
    let frameId: number | undefined;

    const lastReached = (sections: HTMLElement[], activationLine: number) =>
      sections.reduce(
        (active, section) =>
          section.getBoundingClientRect().top <= activationLine
            ? section
            : active,
        sections[0],
      );

    const updateActiveNavigation = () => {
      frameId = undefined;
      const activationLine =
        (wrapperRef.current?.getBoundingClientRect().bottom ?? 80) + 1;
      const reachedPageEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1;
      const groupSection = reachedPageEnd
        ? groupSections[groupSections.length - 1]
        : lastReached(groupSections, activationLine);
      const groupId = groupSection?.dataset.menuGroupId;
      if (!groupId) return;

      const groupCategories = categorySections.filter(
        (section) => section.dataset.menuGroupId === groupId,
      );
      const categorySection = reachedPageEnd
        ? groupCategories[groupCategories.length - 1]
        : lastReached(groupCategories, activationLine);

      if (categorySection?.id) setActiveSlug(categorySection.id);
    };

    const requestUpdate = () => {
      if (frameId === undefined) {
        frameId = window.requestAnimationFrame(updateActiveNavigation);
      }
    };

    updateActiveNavigation();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frameId !== undefined) window.cancelAnimationFrame(frameId);
    };
  }, [groups, orderedCategories]);

  return (
    <div ref={wrapperRef} className="menu-navigation">
      <nav
        ref={categoryNavRef}
        className="category-nav"
        aria-label={ui[locale].menuCategories}
      >
        {orderedCategories.map((category) => (
          <button
            key={category._id}
            ref={(button) => {
              if (button) {
                categoryButtonRefs.current.set(category.slug, button);
              } else {
                categoryButtonRefs.current.delete(category.slug);
              }
            }}
            className="category-link"
            type="button"
            aria-current={activeSlug === category.slug}
            onClick={() => {
              setActiveSlug(category.slug);
              document.getElementById(category.slug)?.scrollIntoView({
                block: "start",
                behavior: "smooth",
              });
            }}
          >
            {category.title}
          </button>
        ))}
      </nav>
    </div>
  );
}
