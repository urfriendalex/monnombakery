"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
  const [indicator, setIndicator] = useState({
    animate: false,
    scaleX: 0,
    visible: false,
    x: 0,
    y: 0,
  });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const categoryNavRef = useRef<HTMLElement>(null);
  const categoryButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const pendingSlugRef = useRef<string | undefined>(undefined);
  const pendingTimeoutRef = useRef<number | undefined>(undefined);
  const animateIndicatorRef = useRef(true);

  useLayoutEffect(() => {
    const nav = categoryNavRef.current;
    const button = activeSlug
      ? categoryButtonRefs.current.get(activeSlug)
      : undefined;

    if (!nav || !button) return;

    const updateIndicator = () => {
      const navRect = nav.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      setIndicator({
        animate: animateIndicatorRef.current,
        scaleX: buttonRect.width,
        visible: true,
        x: nav.scrollLeft + buttonRect.left - navRect.left,
        y: buttonRect.bottom - navRect.top - 7,
      });
      animateIndicatorRef.current = true;
    };

    updateIndicator();
    const resizeObserver = new ResizeObserver(updateIndicator);
    resizeObserver.observe(nav);
    resizeObserver.observe(button);

    return () => resizeObserver.disconnect();
  }, [activeSlug]);

  useEffect(() => {
    const nav = categoryNavRef.current;
    const button = activeSlug
      ? categoryButtonRefs.current.get(activeSlug)
      : undefined;

    if (!nav || !button) return;

    const navRect = nav.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const left = nav.scrollLeft + buttonRect.left - navRect.left;
    const right = left + buttonRect.width;
    const visibleLeft = nav.scrollLeft;
    const visibleRight = visibleLeft + nav.clientWidth;

    if (left < visibleLeft || right > visibleRight) {
      nav.scrollTo({
        left: left + buttonRect.width / 2 - nav.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, [activeSlug]);

  useEffect(() => {
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
      const pendingSlug = pendingSlugRef.current;
      if (pendingSlug) {
        const pendingSection = document.getElementById(pendingSlug);
        if (
          pendingSection &&
          Math.abs(pendingSection.getBoundingClientRect().top - activationLine) > 4 &&
          !reachedPageEnd
        ) {
          setActiveSlug(pendingSlug);
          return;
        }
        pendingSlugRef.current = undefined;
      }

      const categorySection = reachedPageEnd
        ? categorySections[categorySections.length - 1]
        : lastReached(categorySections, activationLine);

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
      if (pendingTimeoutRef.current !== undefined) {
        window.clearTimeout(pendingTimeoutRef.current);
      }
    };
  }, [orderedCategories]);

  return (
    <div ref={wrapperRef} className="menu-navigation">
      <nav
        ref={categoryNavRef}
        className="category-nav"
        aria-label={ui[locale].menuCategories}
      >
        <span
          aria-hidden="true"
          className="category-indicator"
          data-animate={indicator.animate}
          style={{
            opacity: indicator.visible ? 1 : 0,
            transform: `translate3d(${indicator.x}px, ${indicator.y}px, 0) scaleX(${indicator.scaleX})`,
          }}
        />
        {groups.map((group) => {
          const groupCategories = orderedCategories.filter(
            (category) => category.group._ref === group._id,
          );
          if (!groupCategories.length) return null;

          return (
            <div className="category-nav-group" key={group._id}>
              <span className="category-group-label">{group.title}</span>
              {groupCategories.map((category) => (
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
                  onClick={(event) => {
                    animateIndicatorRef.current = event.detail !== 0;
                    pendingSlugRef.current = category.slug;
                    if (pendingTimeoutRef.current !== undefined) {
                      window.clearTimeout(pendingTimeoutRef.current);
                    }
                    pendingTimeoutRef.current = window.setTimeout(() => {
                      pendingSlugRef.current = undefined;
                      window.dispatchEvent(new Event("scroll"));
                    }, 900);
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
            </div>
          );
        })}
      </nav>
    </div>
  );
}
