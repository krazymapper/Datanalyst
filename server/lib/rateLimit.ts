import { createHash } from "node:crypto";

/**
 * Limites d'usage de l'API Gemini, pour qu'un visiteur ne puisse pas épuiser
 * le budget de tous les autres.
 *   - rafale : N requêtes par fenêtre glissante (en mémoire) ;
 *   - quota quotidien : M analyses par jour et par visiteur (persisté).
 * Le visiteur est identifié par un hachage salé de son IP (l'IP brute n'est
 * jamais stockée).
 */

export function visitorKey(ip: string | undefined, salt: string): string {
  return createHash("sha256").update(`${salt}:${ip ?? "unknown"}`).digest("hex").slice(0, 32);
}

export class BurstLimiter {
  private hits = new Map<string, number[]>();
  private readonly max: number;
  private readonly windowMs: number;
  constructor(max: number, windowMs: number) {
    this.max = max;
    this.windowMs = windowMs;
  }

  /** true si la requête est acceptée (et la compte), false si la limite est atteinte. */
  take(key: string, now: number = Date.now()): boolean {
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (recent.length >= this.max) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    if (this.hits.size > 10_000) this.prune(now);
    return true;
  }

  retryAfterSeconds(key: string, now: number = Date.now()): number {
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (recent.length < this.max) return 0;
    return Math.max(1, Math.ceil((this.windowMs - (now - recent[0])) / 1000));
  }

  private prune(now: number) {
    for (const [k, v] of this.hits) {
      if (v.every((t) => now - t >= this.windowMs)) this.hits.delete(k);
    }
  }
}

/** Limite quotidienne : 20 en production par défaut, désactivée en développement. */
export function resolveDailyLimit(env: NodeJS.ProcessEnv): number | null {
  const raw = env.DAILY_QUOTA_LIMIT;
  if (raw !== undefined && raw !== "") {
    const n = Number.parseInt(raw, 10);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return env.NODE_ENV === "production" ? 20 : null;
}

export type QuotaStore = Record<string, number>;

export function dayKey(date: Date, visitor: string): string {
  return `${date.toISOString().slice(0, 10)}_${visitor}`;
}

/** Garde seulement les entrées du jour (le fichier ne grossit pas indéfiniment). */
export function pruneStore(store: QuotaStore, date: Date): QuotaStore {
  const today = date.toISOString().slice(0, 10);
  return Object.fromEntries(Object.entries(store).filter(([k]) => k.startsWith(today)));
}

export function checkAndCount(
  store: QuotaStore,
  visitor: string,
  limit: number | null,
  date: Date = new Date(),
): { allowed: boolean; used: number; store: QuotaStore } {
  const pruned = pruneStore(store, date);
  const key = dayKey(date, visitor);
  const used = pruned[key] ?? 0;
  if (limit !== null && used >= limit) return { allowed: false, used, store: pruned };
  return { allowed: true, used: used + 1, store: { ...pruned, [key]: used + 1 } };
}
