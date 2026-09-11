"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

export type AiStatus = "idle" | "loading" | "success" | "error" | "unavailable";

/** AI 라우트 하나를 부르는 훅. 화면은 status 만 보고 상태를 그린다. */
export function useAiRequest<T>(url: string) {
  const [status, setStatus] = useState<AiStatus>("idle");
  const controller = useRef<AbortController | null>(null);

  useEffect(() => () => controller.current?.abort(), []);

  const run = useCallback(
    async (payload: unknown): Promise<T | null> => {
      controller.current?.abort();
      const ctrl = new AbortController();
      controller.current = ctrl;
      setStatus("loading");
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: ctrl.signal,
        });
        const data = (await res.json().catch(() => ({}))) as { result?: T; error?: string };
        if (res.status === 503 && data.error === "not_configured") {
          setStatus("unavailable");
          return null;
        }
        if (!res.ok || !data.result) {
          setStatus("error");
          return null;
        }
        setStatus("success");
        return data.result;
      } catch (e) {
        if ((e as Error).name !== "AbortError") setStatus("error");
        return null;
      }
    },
    [url],
  );

  const reset = useCallback(() => setStatus("idle"), []);
  return { status, run, reset };
}

let aiReady: boolean | null = null;
const aiListeners = new Set<() => void>();
let asked = false;

function askStatus() {
  if (asked || typeof window === "undefined") return;
  asked = true;
  fetch("/api/status", { cache: "no-store" })
    .then((r) => r.json())
    .then((d: { ai?: boolean }) => {
      aiReady = Boolean(d.ai);
    })
    .catch(() => {
      aiReady = false;
    })
    .finally(() => aiListeners.forEach((l) => l()));
}

/** AI 연결 여부. 아직 모르면 null. */
export function useAiReady(): boolean | null {
  return useSyncExternalStore(
    (l) => {
      aiListeners.add(l);
      askStatus();
      return () => aiListeners.delete(l);
    },
    () => aiReady,
    () => null,
  );
}
