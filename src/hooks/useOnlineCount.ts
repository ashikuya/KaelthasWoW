import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

/**
 * Polls AzerothCore MySQL every `intervalMs` ms for the real online player count.
 * Works unauthenticated (public homepage).
 */
export function useOnlineCount(intervalMs = 60_000) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCount = async () => {
    const { data, error } = await supabase.functions.invoke("azerothcore-api", {
      body: { action: "get_online_count" },
    });
    if (!error && data?.count !== undefined) {
      setCount(Number(data.count));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCount();
    timerRef.current = setInterval(fetchCount, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [intervalMs]);

  return { count, loading };
}
