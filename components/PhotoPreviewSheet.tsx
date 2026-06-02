"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { imageUrlFor } from "@/lib/sanity/image";
import { createPreviewImagePreloader } from "@/lib/preview-image-preload";
import type { MenuItem } from "@/types/menu";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

gsap.registerPlugin(Flip);

const VIEWPORT_MARKER_RATIO = 0.48;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollMenuItemToMarker(
  menuItemId: string,
  immediate = false,
  onComplete?: () => void,
) {
  const element = document.querySelector<HTMLElement>(
    `[data-menu-item-id="${menuItemId}"]`,
  );

  if (!element) {
    onComplete?.();
    return null;
  }

  const rect = element.getBoundingClientRect();
  const viewportMarker = window.innerHeight * VIEWPORT_MARKER_RATIO;
  const targetScrollY =
    window.scrollY + rect.top + rect.height / 2 - viewportMarker;

  window.dispatchEvent(
    new CustomEvent("smooth-scroll:scroll-to", {
      detail: { top: targetScrollY, immediate, onComplete },
    }),
  );

  return targetScrollY;
}

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
  const [isFlipping, setIsFlipping] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previewButtonRef = useRef<HTMLButtonElement>(null);
  const viewerStageRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const incomingImageRef = useRef<HTMLSpanElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const lastScrollYRef = useRef(0);
  const lockedPreviewIndexRef = useRef<number | null>(null);
  const pointerStartXRef = useRef<number | null>(null);
  const pointerDraggedRef = useRef(false);
  const revealDirectionRef = useRef<"down" | "up">("down");
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const flipPendingRef = useRef<"open" | "close" | null>(null);
  const flipTweenRef = useRef<gsap.core.Animation | null>(null);
  const chromeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const closeFinishRef = useRef<(() => void) | null>(null);
  const isAnimatingRef = useRef(false);
  const imagePreloaderRef = useRef(createPreviewImagePreloader());
  const pendingShowRef = useRef<{ index: number; direction: "down" | "up" } | null>(null);
  const [incomingReady, setIncomingReady] = useState(false);
  const activeItem = previewItems[activeIndex];
  const incomingItem = incomingIndex === null ? null : previewItems[incomingIndex];
  const displayIndex =
    incomingReady && incomingIndex !== null ? incomingIndex : activeIndex;
  const displayItem = previewItems[displayIndex] ?? activeItem;

  const markImageLoaded = useCallback((url: string) => {
    imagePreloaderRef.current.markLoaded(url);
  }, []);

  const getChromeTargets = useCallback(() => {
    const captionLines = captionRef.current?.querySelectorAll(".viewer-caption-line > span");
    const controls = controlsRef.current;
    const closeBtn = closeButtonRef.current;

    return {
      captionLines: captionLines ? Array.from(captionLines) : [],
      controls,
      closeBtn,
    };
  }, []);

  const hideChrome = useCallback(
    (immediate = false) => {
      const { captionLines, controls, closeBtn } = getChromeTargets();

      chromeTimelineRef.current?.kill();
      gsap.killTweensOf([...captionLines, controls, closeBtn].filter(Boolean));

      if (captionRef.current) {
        captionRef.current.style.visibility = "hidden";
      }

      if (controls) {
        controls.style.visibility = "hidden";
        controls.style.pointerEvents = "none";
      }

      if (closeBtn) {
        closeBtn.style.visibility = "hidden";
        closeBtn.style.pointerEvents = "none";
      }

      gsap.set([...captionLines, controls, closeBtn].filter(Boolean), {
        opacity: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        clearProps: "transform,filter",
        immediateRender: immediate,
      });
    },
    [getChromeTargets],
  );

  const animateChromeEnter = useCallback(
    (immediate = false) => {
      const { captionLines, controls, closeBtn } = getChromeTargets();

      chromeTimelineRef.current?.kill();

      if (captionRef.current) {
        captionRef.current.style.visibility = "visible";
      }

      if (controls) {
        controls.style.visibility = "visible";
        controls.style.pointerEvents = "auto";
      }

      if (closeBtn) {
        closeBtn.style.visibility = "visible";
        closeBtn.style.pointerEvents = "auto";
      }

      if (immediate || prefersReducedMotion()) {
        gsap.set([...captionLines, controls, closeBtn].filter(Boolean), {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        });
        closeButtonRef.current?.focus();
        return;
      }

      gsap.set(captionLines, { y: 12, opacity: 0, filter: "blur(4px)" });
      gsap.set(controls, { y: 36, opacity: 0 });
      gsap.set(closeBtn, { y: -36, opacity: 0 });

      const timeline = gsap.timeline({
        onComplete: () => {
          closeButtonRef.current?.focus();
        },
      });

      if (captionLines[0]) {
        timeline.to(
          captionLines[0],
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.3, ease: "power3.out" },
          0,
        );
      }

      if (captionLines[1]) {
        timeline.to(
          captionLines[1],
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.3, ease: "power3.out" },
          0.08,
        );
      }

      if (closeBtn) {
        timeline.to(closeBtn, { y: 0, opacity: 1, duration: 0.34, ease: "power3.out" }, 0.06);
      }

      if (controls) {
        timeline.to(controls, { y: 0, opacity: 1, duration: 0.34, ease: "power3.out" }, 0.1);
      }

      chromeTimelineRef.current = timeline;
    },
    [getChromeTargets],
  );

  const animateChromeExit = useCallback(
    (onComplete: () => void) => {
      const { captionLines, controls, closeBtn } = getChromeTargets();

      chromeTimelineRef.current?.kill();

      if (prefersReducedMotion()) {
        hideChrome(true);
        onComplete();
        return;
      }

      const timeline = gsap.timeline({ onComplete });

      if (captionLines[0]) {
        timeline.to(
          captionLines[0],
          { y: -8, opacity: 0, duration: 0.15, ease: "power2.in" },
          0,
        );
      }

      if (captionLines[1]) {
        timeline.to(
          captionLines[1],
          { y: -8, opacity: 0, duration: 0.15, ease: "power2.in" },
          0.04,
        );
      }

      if (controls) {
        timeline.to(controls, { y: 24, opacity: 0, duration: 0.15, ease: "power2.in" }, 0.06);
      }

      if (closeBtn) {
        timeline.to(closeBtn, { y: -24, opacity: 0, duration: 0.15, ease: "power2.in" }, 0);
      }

      chromeTimelineRef.current = timeline;
    },
    [getChromeTargets, hideChrome],
  );

  useLayoutEffect(() => {
    hideChrome(true);
  }, [hideChrome]);

  useLayoutEffect(() => {
    if (flipPendingRef.current === null || !flipStateRef.current) {
      return;
    }

    const direction = flipPendingRef.current;
    flipPendingRef.current = null;
    const state = flipStateRef.current;
    flipStateRef.current = null;
    const stage = viewerStageRef.current;

    if (!stage) {
      return;
    }

    if (prefersReducedMotion()) {
      if (direction === "open") {
        animateChromeEnter(true);
      } else {
        hideChrome(true);
        closeFinishRef.current?.();
        closeFinishRef.current = null;
      }

      return;
    }

    isAnimatingRef.current = true;
    setIsFlipping(true);
    stage.style.willChange = "transform";

    flipTweenRef.current?.kill();
    flipTweenRef.current = Flip.from(state, {
      duration: 0.52,
      ease: "power2.inOut",
      absolute: true,
      scale: true,
      onComplete: () => {
        if (direction === "close") {
          gsap.set(stage, { clearProps: "transform,top,left,width,height,margin" });
        }
        stage.style.willChange = "";
        isAnimatingRef.current = false;
        setIsFlipping(false);
        flipTweenRef.current = null;

        if (direction === "open") {
          animateChromeEnter(false);
        } else {
          hideChrome(true);
          closeFinishRef.current?.();
          closeFinishRef.current = null;
        }
      },
    });
  }, [isOpen, animateChromeEnter, hideChrome]);

  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-menu-item-id]").forEach((element) => {
      const highlightedItemId = isOpen ? displayItem?.id : activeMenuItemId;

      if (element.dataset.menuItemId === highlightedItemId) {
        element.dataset.viewerActive = "true";
      } else {
        delete element.dataset.viewerActive;
      }
    });
  }, [activeMenuItemId, displayItem?.id, isOpen]);

  useEffect(() => {
    if (!previewItems.length) {
      return;
    }

    const preloader = imagePreloaderRef.current;
    const warmNeighbors = (index: number) => {
      const length = previewItems.length;

      for (let offset = -2; offset <= 2; offset += 1) {
        const neighbor = previewItems[(index + offset + length) % length];

        if (neighbor) {
          void preloader.prefetch(neighbor.imageUrl);
        }
      }
    };

    warmNeighbors(activeIndex);

    previewItems.forEach((item) => {
      void preloader.prefetch(item.imageUrl);
    });
  }, [activeIndex, isOpen, previewItems]);

  useEffect(() => {
    if (incomingIndex === null) {
      setIncomingReady(false);
      return;
    }

    const url = previewItems[incomingIndex]?.imageUrl;

    if (!url) {
      return;
    }

    const preloader = imagePreloaderRef.current;

    if (preloader.isLoaded(url)) {
      setIncomingReady(true);
      return;
    }

    setIncomingReady(false);

    void preloader.prefetch(url).then(
      () => {
        setIncomingReady(true);
      },
      () => {
        setIncomingReady(true);
      },
    );
  }, [incomingIndex, previewItems]);

  const showItem = useCallback(
    (index: number, direction: "down" | "up") => {
      if (index === activeIndex && incomingIndex === null) {
        return;
      }

      if (incomingIndex !== null) {
        pendingShowRef.current = { index, direction };
        return;
      }

      const item = previewItems[index];

      if (!item) {
        return;
      }

      const preloader = imagePreloaderRef.current;
      const beginTransition = () => {
        revealDirectionRef.current = direction;
        setIncomingReady(preloader.isLoaded(item.imageUrl));
        setIncomingIndex(index);
      };

      if (preloader.isLoaded(item.imageUrl)) {
        beginTransition();
        return;
      }

      void preloader.prefetch(item.imageUrl).then(beginTransition, beginTransition);
    },
    [activeIndex, incomingIndex, previewItems],
  );

  useLayoutEffect(() => {
    const incomingImage = incomingImageRef.current;

    if (!incomingImage || incomingIndex === null || !incomingReady) {
      return;
    }

    const reduceMotion = prefersReducedMotion();
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
          gsap.set(incomingImage, {
            clearProps: "opacity,transform,xPercent,yPercent",
          });
          setActiveIndex(incomingIndex);
          setIncomingIndex(null);
          setIncomingReady(false);

          const pending = pendingShowRef.current;

          if (pending) {
            pendingShowRef.current = null;
            requestAnimationFrame(() => {
              showItem(pending.index, pending.direction);
            });
          }
        },
      },
    );

    return () => {
      revealTween.kill();
    };
  }, [incomingIndex, incomingReady, isOpen, showItem]);

  const showPrevious = useCallback(() => {
    showItem((activeIndex - 1 + previewItems.length) % previewItems.length, "up");
  }, [activeIndex, previewItems.length, showItem]);

  const showNext = useCallback(() => {
    showItem((activeIndex + 1) % previewItems.length, "down");
  }, [activeIndex, previewItems.length, showItem]);

  const scrollToActiveMenuItemOnClose = useCallback(() => {
    const menuItemId = (incomingItem ?? activeItem)?.id;

    if (!menuItemId) {
      return;
    }

    const index = previewItems.findIndex((item) => item.id === menuItemId);

    if (index === -1) {
      return;
    }

    lockedPreviewIndexRef.current = index;
    setActiveIndex(index);
    setIncomingIndex(null);
    setActiveMenuItemId(menuItemId);

    requestAnimationFrame(() => {
      const targetScrollY = scrollMenuItemToMarker(
        menuItemId,
        prefersReducedMotion(),
        () => {
          lockedPreviewIndexRef.current = null;
        },
      );

      if (targetScrollY !== null) {
        lastScrollYRef.current = targetScrollY;
      }
    });
  }, [activeItem, incomingItem, previewItems]);

  const runFlipClose = useCallback(() => {
    const stage = viewerStageRef.current;

    const finishClose = () => {
      setIsDismissed(false);
      requestAnimationFrame(() => {
        previouslyFocusedRef.current?.focus();
        previouslyFocusedRef.current = null;
      });
    };

    if (!stage || prefersReducedMotion()) {
      hideChrome(true);
      scrollToActiveMenuItemOnClose();
      setIsOpen(false);
      finishClose();
      return;
    }

    flipTweenRef.current?.kill();
    chromeTimelineRef.current?.kill();

    const startCloseFlip = () => {
      scrollToActiveMenuItemOnClose();
      flipStateRef.current = Flip.getState(stage);
      flipPendingRef.current = "close";
      closeFinishRef.current = finishClose;
      setIsOpen(false);
    };

    if (isOpen) {
      animateChromeExit(startCloseFlip);
    } else {
      startCloseFlip();
    }
  }, [animateChromeExit, hideChrome, isOpen, scrollToActiveMenuItemOnClose]);

  const closePreview = useCallback(() => {
    if (!isOpen && !isAnimatingRef.current) {
      return;
    }

    runFlipClose();
  }, [isOpen, runFlipClose]);

  const openPreview = useCallback(
    (index?: number) => {
      lockedPreviewIndexRef.current = null;
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

      if (index !== undefined) {
        setActiveIndex(index);
        setIncomingIndex(null);
      }

      const stage = viewerStageRef.current;

      if (!stage || prefersReducedMotion()) {
        setIsOpen(true);
        requestAnimationFrame(() => animateChromeEnter(true));
        return;
      }

      flipTweenRef.current?.kill();
      chromeTimelineRef.current?.kill();
      hideChrome(true);
      setIsDismissed(false);

      flipStateRef.current = Flip.getState(stage);
      flipPendingRef.current = "open";
      setIsOpen(true);
    },
    [animateChromeEnter, hideChrome],
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
      if (isOpen || lockedPreviewIndexRef.current !== null) {
        return;
      }

      const currentScrollY = window.scrollY;

      if (currentScrollY !== lastScrollYRef.current) {
        revealDirectionRef.current =
          currentScrollY > lastScrollYRef.current ? "down" : "up";
        lastScrollYRef.current = currentScrollY;
      }

      const viewportMarker = window.innerHeight * VIEWPORT_MARKER_RATIO;
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
      if (isAnimatingRef.current) {
        return;
      }

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
      {activeItem && displayItem ? (
        <div
          className={`image-viewer${isOpen ? " is-open" : ""}${isDismissed ? " is-dismissed" : ""}${isFlipping ? " is-flipping" : ""}`}
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
          <div ref={viewerStageRef} className="viewer-stage">
            <button
              ref={previewButtonRef}
              className="viewer-image-button"
              type="button"
              aria-label={`Otwórz zdjęcie: ${displayItem.title}`}
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
              {previewItems.map((item, index) => {
                const isActive = index === activeIndex;
                const isIncoming = incomingIndex !== null && index === incomingIndex;
                const isOnStage = isActive || isIncoming;

                return (
                  <span
                    key={item.id}
                    ref={isIncoming ? incomingImageRef : undefined}
                    className={`viewer-image-layer${isActive ? " is-active" : ""}${isIncoming ? " is-incoming" : ""}${!isOnStage ? " is-buffered" : ""}${isIncoming && !incomingReady ? " is-pending" : ""}`}
                    aria-hidden={!isOnStage}
                    style={{
                      display: "block",
                      inset: 0,
                      position: "absolute",
                      zIndex: isIncoming ? 2 : isOnStage ? 1 : 0,
                    }}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={isOnStage ? item.imageAlt : ""}
                      fill
                      priority={isOnStage}
                      loading="eager"
                      sizes="(min-width: 700px) 620px, 92vw"
                      style={{ objectFit: "cover" }}
                      onLoad={() => {
                        markImageLoaded(item.imageUrl);

                        if (isIncoming) {
                          setIncomingReady(true);
                        }
                      }}
                    />
                  </span>
                );
              })}
            </button>
            <div ref={captionRef} className="viewer-caption">
              <h3 id="viewer-title" className="viewer-caption-line">
                <span>{displayItem.title}</span>
              </h3>
              <p className="viewer-caption-line viewer-caption-description">
                <span>{displayItem.description ?? "\u00a0"}</span>
              </p>
            </div>
          </div>
          <div ref={controlsRef} className="viewer-controls">
            <button type="button" onClick={showPrevious} aria-label="Poprzednie zdjęcie">
              ←
            </button>
            <span aria-live="polite">{displayIndex + 1} / {previewItems.length}</span>
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
