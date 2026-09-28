import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/** true hanya setelah komponen ter-hidrasi di client, false saat render di server. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
