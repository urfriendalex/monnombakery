"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type PreviewPayload = {
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
};

type PhotoPreviewContextValue = {
  openPreview: (payload: PreviewPayload) => void;
};

const PhotoPreviewContext = createContext<PhotoPreviewContextValue | null>(null);

export function usePhotoPreview() {
  const context = useContext(PhotoPreviewContext);

  if (!context) {
    throw new Error("usePhotoPreview must be used inside PhotoPreviewProvider");
  }

  return context;
}

export function PhotoPreviewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preview, setPreview] = useState<PreviewPayload | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const closePreview = useCallback(() => {
    setPreview(null);
    previouslyFocusedRef.current?.focus();
  }, []);

  const openPreview = useCallback((payload: PreviewPayload) => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    setPreview(payload);
  }, []);

  useEffect(() => {
    if (!preview) {
      return;
    }

    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePreview();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [closePreview, preview]);

  return (
    <PhotoPreviewContext.Provider value={{ openPreview }}>
      {children}
      {preview ? (
        <div
          className="preview-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePreview();
            }
          }}
        >
          <aside
            className="preview-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-title"
            tabIndex={-1}
          >
            <button
              ref={closeButtonRef}
              className="preview-close"
              type="button"
              aria-label="Zamknij podgląd zdjęcia"
              onClick={closePreview}
            >
              ×
            </button>
            <div className="preview-image-wrap">
              <Image
                src={preview.imageUrl}
                alt={preview.imageAlt}
                fill
                sizes="(min-width: 700px) 520px, 100vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="preview-caption">
              <h3 id="preview-title">{preview.title}</h3>
              {preview.description ? <p>{preview.description}</p> : null}
            </div>
          </aside>
        </div>
      ) : null}
    </PhotoPreviewContext.Provider>
  );
}
