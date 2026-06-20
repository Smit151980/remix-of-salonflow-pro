import { useEffect, useState } from "react";

/**
 * Simulated realtime hook. When Lovable Cloud is enabled, swap the body for:
 *
 *   const channel = supabase.channel(`${table}-changes`).on(
 *     'postgres_changes',
 *     { event: '*', schema: 'public', table },
 *     (payload) => onChange?.(payload)
 *   ).subscribe();
 *   return () => { supabase.removeChannel(channel); };
 */
export function useRealtimeSubscription(
  table: string,
  onChange?: (payload: { eventType: "INSERT" | "UPDATE" | "DELETE"; table: string; at: number }) => void,
  intervalMs = 8000,
) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
      const events: Array<"INSERT" | "UPDATE" | "DELETE"> = ["INSERT", "UPDATE", "UPDATE", "DELETE"];
      const e = events[Math.floor(Math.random() * events.length)];
      onChange?.({ eventType: e, table, at: Date.now() });
    }, intervalMs);
    return () => clearInterval(id);
  }, [table, intervalMs, onChange]);
  return tick;
}

/** Gentle number jitter so KPI cards feel live. */
export function useLiveNumber(initial: number, { volatility = 0.01, intervalMs = 5000 } = {}) {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => {
        const delta = v * volatility * (Math.random() - 0.3);
        return Math.max(0, Math.round(v + delta));
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [volatility, intervalMs]);
  return value;
}
