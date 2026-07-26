import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const STORAGE_KEYS = ["auth", "cockroachhub-theme", "cockroachhub-locale", "protest-checklist"];

export function useAutoErase(enabled: boolean, timeoutMinutes: number = 30, t?: (s: string) => string) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const warningRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const warnedRef = useRef(false);
  const translate = t || ((s: string) => s);

  const erase = useCallback(() => {
    STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    if ("caches" in window) {
      caches.keys().then((names) => names.forEach((n) => caches.delete(n)));
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) =>
        regs.forEach((r) => r.unregister())
      );
    }
    toast.error(translate("autoErase.erased"), { duration: 5000 });
    setTimeout(() => window.location.reload(), 2000);
  }, [translate]);

  const resetTimer = useCallback(() => {
    warnedRef.current = false;
    clearTimeout(timerRef.current);
    clearTimeout(warningRef.current);

    if (!enabled) return;

    warningRef.current = setTimeout(() => {
      if (!warnedRef.current) {
        warnedRef.current = true;
        toast(
          translate("autoErase.warning"),
          { duration: 25000, icon: "⚠️" }
        );
      }
    }, (timeoutMinutes * 60 - 30) * 1000);

    timerRef.current = setTimeout(erase, timeoutMinutes * 60 * 1000);
  }, [enabled, timeoutMinutes, erase, translate]);

  useEffect(() => {
    if (!enabled) {
      clearTimeout(timerRef.current);
      clearTimeout(warningRef.current);
      return;
    }

    let debounceTimer: ReturnType<typeof setTimeout> | undefined;
    const handler = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(resetTimer, 500);
    };

    resetTimer();

    window.addEventListener("mousemove", handler, { passive: true });
    window.addEventListener("keydown", handler, { passive: true });
    window.addEventListener("touchstart", handler, { passive: true });
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("visibilitychange", handler, { passive: true });

    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("mousemove", handler);
      window.removeEventListener("keydown", handler);
      window.removeEventListener("touchstart", handler);
      window.removeEventListener("scroll", handler);
      window.removeEventListener("visibilitychange", handler);
      clearTimeout(timerRef.current);
      clearTimeout(warningRef.current);
    };
  }, [enabled, resetTimer]);

  return { erase, resetTimer };
}
