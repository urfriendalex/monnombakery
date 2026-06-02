export function createPreviewImagePreloader() {
  const loaded = new Set<string>();
  const inflight = new Map<string, Promise<void>>();

  function prefetch(url: string): Promise<void> {
    if (loaded.has(url)) {
      return Promise.resolve();
    }

    const existing = inflight.get(url);

    if (existing) {
      return existing;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        loaded.add(url);
        inflight.delete(url);
        resolve();
      };

      img.onerror = () => {
        inflight.delete(url);
        reject(new Error(`Failed to preload ${url}`));
      };

      img.src = url;
    });

    inflight.set(url, promise);

    return promise;
  }

  function isLoaded(url: string) {
    return loaded.has(url);
  }

  function markLoaded(url: string) {
    loaded.add(url);
  }

  return { prefetch, isLoaded, markLoaded };
}
