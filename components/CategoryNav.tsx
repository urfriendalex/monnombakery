"use client";

import { useEffect, useRef, useState } from "react";
import { ui, type Locale } from "@/lib/i18n";
import type { MenuGroup } from "@/types/menu";

export function CategoryNav({
  groups,
  locale,
}: {
  groups: MenuGroup[];
  locale: Locale;
}) {
  const [activeGroupId, setActiveGroupId] = useState(groups[0]?._id);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = groups
      .map((group) => document.getElementById(group.slug))
      .filter((section): section is HTMLElement => section !== null);
    let frameId: number | undefined;

    const updateActiveGroup = () => {
      frameId = undefined;
      const activationLine = navRef.current?.getBoundingClientRect().bottom ?? 46;
      const reachedPageEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1;
      const activeSection = reachedPageEnd
        ? sections[sections.length - 1]
        : sections.reduce(
            (active, section) =>
              section.getBoundingClientRect().top <= activationLine
                ? section
                : active,
            sections[0],
          );

      if (activeSection?.dataset.menuGroupId) {
        setActiveGroupId(activeSection.dataset.menuGroupId);
      }
    };

    const requestActiveGroupUpdate = () => {
      if (frameId === undefined) {
        frameId = window.requestAnimationFrame(updateActiveGroup);
      }
    };

    updateActiveGroup();
    window.addEventListener("scroll", requestActiveGroupUpdate, {
      passive: true,
    });
    window.addEventListener("resize", requestActiveGroupUpdate);

    return () => {
      window.removeEventListener("scroll", requestActiveGroupUpdate);
      window.removeEventListener("resize", requestActiveGroupUpdate);
      if (frameId !== undefined) window.cancelAnimationFrame(frameId);
    };
  }, [groups]);

  return (
    <nav ref={navRef} className="menu-navigation group-nav" aria-label={ui[locale].menuGroups}>
      {groups.map((group) => (
        <button
          key={group._id}
          className="group-link"
          type="button"
          aria-current={activeGroupId === group._id}
          onClick={() => {
            setActiveGroupId(group._id);
            document.getElementById(group.slug)?.scrollIntoView({
              block: "start",
              behavior: "smooth",
            });
          }}
        >
          {group.title}
        </button>
      ))}
    </nav>
  );
}
