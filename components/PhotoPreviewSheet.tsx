"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { imageUrlFor } from "@/lib/sanity/image";
import type { MenuItem } from "@/types/menu";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

export function PhotoPreviewProvider({
  children,
  items,
}: {
  children: React.ReactNode;
  items: MenuItem[];
}) {
  const previewItems = useMemo(
    () =>
      items.flatMap((item) => {
        const imageUrl = imageUrlFor(item.image, 1600);

        return imageUrl
          ? [
              {
                id: item._id,
                title: item.name,
                description: item.description,
                imageUrl,
                imageAlt: item.imageAlt ?? item.image?.alt ?? item.name,
              },
            ]
          : [];
      }),
    [items],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [activeMenuItemId, setActiveMenuItemId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previewButtonRef = useRef<HTMLButtonElement>(null);
  const incomingImageRef = useRef<HTMLSpanElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const lastScrollYRef = useRef(0);
  const pointerStartXRef = useRef<number | null>(null);
  const pointerDraggedRef = useRef(false);
  const revealDirectionRef = useRef<"down" | "up">("down");
  const activeItem = previewItems[activeIndex];
  const incomingItem = incomingIndex === null ? null : previewItems[incomingIndex];
  const visibleItem = incomingItem ?? activeItem;

  useLayoutEffect(() => {
    const captionLines = captionRef.current?.querySelectorAll(".viewer-caption-line > span");

    if (!isOpen || !captionLines?.length) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const captionTween = gsap.fromTo(
      captionLines,
      { yPercent: reduceMotion ? 0 : 110 },
      {
        yPercent: 0,
        duration: reduceMotion ? 0 : 0.34,
        ease: "power3.out",
        stagger: reduceMotion ? 0 : 0.055,
        overwrite: "auto",
      },
    );

    return () => {
      captionTween.kill();
    };
  }, [isOpen, visibleItem?.id]);

  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-menu-item-id]").forEach((element) => {
      const highlightedItemId = isOpen ? visibleItem?.id : activeMenuItemId;

      if (element.dataset.menuItemId === highlightedItemId) {
        element.dataset.viewerActive = "true";
      } else {
        delete element.dataset.viewerActive;
      }
    });
  }, [activeMenuItemId, isOpen, visibleItem?.id]);

  useLayoutEffect(() => {
    const incomingImage = incomingImageRef.current;

    if (!incomingImage || incomingIndex === null) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealFrom = reduceMotion
      ? { opacity: 1, xPercent: 0, yPercent: 0 }
      : isOpen
        ? { opacity: 0, xPercent: 0, yPercent: 0 }
        : {
            opacity: 1,
            xPercent: 0,
            yPercent: revealDirectionRef.current === "down" ? -100 : 100,
          };
    const revealTween = gsap.fromTo(
      incomingImage,
      revealFrom,
      {
        opacity: 1,
        xPercent: 0,
        yPercent: 0,
        duration: reduceMotion ? 0 : isOpen ? 0.16 : 0.32,
        ease: isOpen ? "power2.out" : "power2.inOut",
        overwrite: "auto",
        onComplete: () => {
          setActiveIndex(incomingIndex);
        },
      },
    );

    return () => {
      revealTween.kill();
    };
  }, [incomingIndex, isOpen]);

  const showItem = useCallback(
    (index: number, direction: "down" | "up") => {
      if (index === activeIndex || incomingIndex !== null) {
        return;
      }

      revealDirectionRef.current = direction;
      setIncomingIndex(index);
    },
    [activeIndex, incomingIndex],
  );

  const showPrevious = useCallback(() => {
    showItem((activeIndex - 1 + previewItems.length) % previewItems.length, "up");
  }, [activeIndex, previewItems.length, showItem]);

  const showNext = useCallback(() => {
    showItem((activeIndex + 1) % previewItems.length, "down");
  }, [activeIndex, previewItems.length, showItem]);

  const closePreview = useCallback(() => {
    setIsOpen(false);
    setIsDismissed(false);
    requestAnimationFrame(() => {
      previouslyFocusedRef.current?.focus();
      previouslyFocusedRef.current = null;
    });
  }, []);

  const openPreview = useCallback(
    (index?: number) => {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

      if (index !== undefined) {
        setActiveIndex(index);
        setIncomingIndex(null);
      }

      setIsOpen(true);
    },
    [],
  );

  useEffect(() => {
    const onPhotoTriggerClick = (event: MouseEvent) => {
      const trigger = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-photo-preview-id]",
      );
      const index = previewItems.findIndex((item) => item.id === trigger?.dataset.photoPreviewId);

      if (index !== -1) {
        openPreview(index);
      }
    };

    document.addEventListener("click", onPhotoTriggerClick);

    return () => {
      document.removeEventListener("click", onPhotoTriggerClick);
    };
  }, [openPreview, previewItems]);

  useEffect(() => {
    if (!previewItems.length) {
      return;
    }

    const updateActiveItem = () => {
      if (isOpen) {
        return;
      }

      const currentScrollY = window.scrollY;

      if (currentScrollY !== lastScrollYRef.current) {
        revealDirectionRef.current =
          currentScrollY > lastScrollYRef.current ? "down" : "up";
        lastScrollYRef.current = currentScrollY;
      }

      const viewportMarker = window.innerHeight * 0.48;
      const menuElements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-menu-item-id]"),
      );
      let closestMenuItemId: string | null = null;
      let closestMenuItemDistance = Number.POSITIVE_INFINITY;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      menuElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - viewportMarker);

        if (distance < closestMenuItemDistance) {
          closestMenuItemDistance = distance;
          closestMenuItemId = element.dataset.menuItemId ?? null;
        }
      });

      previewItems.forEach((item, index) => {
        const element = document.querySelector<HTMLElement>(
          `[data-menu-item-id="${item.id}"]`,
        );

        if (!element) {
          return;
        }

        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - viewportMarker);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveMenuItemId(closestMenuItemId);
      showItem(closestIndex, revealDirectionRef.current);
    };

    lastScrollYRef.current = window.scrollY;
    updateActiveItem();
    window.addEventListener("scroll", updateActiveItem, { passive: true });
    window.addEventListener("resize", updateActiveItem);

    return () => {
      window.removeEventListener("scroll", updateActiveItem);
      window.removeEventListener("resize", updateActiveItem);
    };
  }, [isOpen, previewItems, showItem]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";
    window.dispatchEvent(
      new CustomEvent("smooth-scroll:set-stopped", {
        detail: { stopped: true },
      }),
    );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePreview();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      window.dispatchEvent(
        new CustomEvent("smooth-scroll:set-stopped", {
          detail: { stopped: false },
        }),
      );
    };
  }, [closePreview, isOpen, showNext, showPrevious]);

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    pointerStartXRef.current = event.clientX;
    pointerDraggedRef.current = false;

    if (event.currentTarget.setPointerCapture) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Safari can reject capture while a native scroll gesture is starting.
      }
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const pointerStartX = pointerStartXRef.current;

    if (pointerStartX !== null && Math.abs(event.clientX - pointerStartX) > 8) {
      pointerDraggedRef.current = true;
    }
  };

  const onPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const pointerStartX = pointerStartXRef.current;
    pointerStartXRef.current = null;

    if (pointerStartX === null) {
      return;
    }

    const distance = event.clientX - pointerStartX;

    if (!isOpen) {
      if (distance < -42) {
        setIsDismissed(true);
      }

      return;
    }

    if (Math.abs(distance) < 42) {
      return;
    }

    if (distance < 0) {
      showNext();
    } else {
      showPrevious();
    }
  };

  const onPointerCancel = () => {
    pointerStartXRef.current = null;
    pointerDraggedRef.current = false;
  };

  return (
    <>
      {children}
      {activeItem && visibleItem ? (
        <div
          className={`image-viewer${isOpen ? " is-open" : ""}${isDismissed ? " is-dismissed" : ""}`}
          role={isOpen ? "dialog" : undefined}
          aria-modal={isOpen ? "true" : undefined}
          aria-labelledby={isOpen ? "viewer-title" : undefined}
        >
          <div
            className="viewer-backdrop"
            onClick={(event) => {
              if (event.target === event.currentTarget) closePreview();
            }}
          />
          <div className="viewer-stage">
            <button
              ref={previewButtonRef}
              className="viewer-image-button"
              type="button"
              aria-label={`Otwórz zdjęcie: ${visibleItem.title}`}
              onClick={() => {
                if (!pointerDraggedRef.current) {
                  openPreview();
                }
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
            >
              <span
                className="viewer-image-layer"
                style={{ display: "block", inset: 0, position: "absolute" }}
              >
                <Image
                  key={activeItem.id}
                  src={activeItem.imageUrl}
                  alt={activeItem.imageAlt}
                  fill
                  loading="eager"
                  sizes={isOpen ? "(min-width: 700px) 620px, 92vw" : "160px"}
                  style={{ objectFit: "cover" }}
                  onLoad={() => {
                    if (incomingIndex === activeIndex) {
                      setIncomingIndex(null);
                    }
                  }}
                />
              </span>
              {incomingItem ? (
                <span
                  ref={incomingImageRef}
                  className="viewer-image-layer is-incoming"
                  style={{ display: "block", inset: 0, position: "absolute" }}
                >
                  <Image
                    key={incomingItem.id}
                    src={incomingItem.imageUrl}
                    alt={incomingItem.imageAlt}
                    fill
                    loading="eager"
                    sizes={isOpen ? "(min-width: 700px) 620px, 92vw" : "160px"}
                    style={{ objectFit: "cover" }}
                  />
                </span>
              ) : null}
            </button>
            <div ref={captionRef} className="viewer-caption">
              <h3 id="viewer-title" className="viewer-caption-line">
                <span>{visibleItem.title}</span>
              </h3>
              <p className="viewer-caption-line viewer-caption-description">
                <span>{visibleItem.description ?? "\u00a0"}</span>
              </p>
            </div>
          </div>
          <div className="viewer-controls">
            <button type="button" onClick={showPrevious} aria-label="Poprzednie zdjęcie">
              ←
            </button>
            <span aria-live="polite">{(incomingIndex ?? activeIndex) + 1} / {previewItems.length}</span>
            <button type="button" onClick={showNext} aria-label="Następne zdjęcie">
              →
            </button>
          </div>
          <button
            ref={closeButtonRef}
            className="viewer-close"
            type="button"
            aria-label="Zamknij podgląd zdjęcia"
            onClick={closePreview}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      ) : null}
    </>
  );
}
