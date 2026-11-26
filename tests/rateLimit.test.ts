import { test } from "node:test";
import assert from "node:assert/strict";
import { BurstLimiter, checkAndCount, resolveDailyLimit, visitorKey, pruneStore } from "../server/lib/rateLimit.ts";

test("clé visiteur : hachée, salée, stable, sans IP en clair", () => {
  const a = visitorKey("203.0.113.7", "sel");
  assert.equal(a, visitorKey("203.0.113.7", "sel"));
  assert.notEqual(a, visitorKey("203.0.113.8", "sel"));
  assert.notEqual(a, visitorKey("203.0.113.7", "autre-sel"));
  assert.ok(!a.includes("203"));
});

test("rafale : 3 requêtes par minute, puis refus, puis reprise", () => {
  const l = new BurstLimiter(3, 60_000);
  const t0 = 1_000_000;
  assert.equal(l.take("v", t0), true);
  assert.equal(l.take("v", t0 + 1), true);
  assert.equal(l.take("v", t0 + 2), true);
  assert.equal(l.take("v", t0 + 3), false);
  assert.equal(l.retryAfterSeconds("v", t0 + 3), 60);
  assert.equal(l.take("autre", t0 + 3), true); // les visiteurs sont indépendants
  assert.equal(l.take("v", t0 + 60_001), true);
});

test("limite quotidienne : 20 en production, illimitée en développement, réglable", () => {
  assert.equal(resolveDailyLimit({ NODE_ENV: "production" }), 20);
  assert.equal(resolveDailyLimit({ NODE_ENV: "development" }), null);
  assert.equal(resolveDailyLimit({ NODE_ENV: "production", DAILY_QUOTA_LIMIT: "5" }), 5);
  assert.equal(resolveDailyLimit({ NODE_ENV: "production", DAILY_QUOTA_LIMIT: "abc" }), 20);
});

test("quota : compte par visiteur et par jour, refuse au-delà", () => {
  const d = new Date("2026-11-26T10:00:00Z");
  let store = {};
  for (let i = 0; i < 2; i++) {
    const r = checkAndCount(store, "v1", 2, d);
    assert.equal(r.allowed, true);
    store = r.store;
  }
  const refused = checkAndCount(store, "v1", 2, d);
  assert.equal(refused.allowed, false);
  assert.equal(refused.used, 2);
  assert.equal(checkAndCount(store, "v2", 2, d).allowed, true); // un autre visiteur n'est pas bloqué
  assert.equal(checkAndCount(store, "v1", 2, new Date("2026-11-27T00:00:01Z")).allowed, true); // nouveau jour
});

test("le fichier de quota ne garde que le jour courant", () => {
  const d = new Date("2026-11-26T10:00:00Z");
  assert.deepEqual(Object.keys(pruneStore({ "2026-11-25_a": 3, "2026-11-26_b": 1 }, d)), ["2026-11-26_b"]);
});
