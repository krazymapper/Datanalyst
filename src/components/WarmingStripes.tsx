import React, { useMemo } from 'react';

/**
 * Bandes de réchauffement (idiome visuel « warming stripes ») pilotées par le
 * scénario SSP choisi. ILLUSTRATION LISSÉE, pas une série de mesures :
 *   - 1850-1900 : référence (0 °C) ;
 *   - 2011-2020 : ≈ +1,1 °C (ordre de grandeur, non vérifié dans ce code) ;
 *   - 2081-2100 : meilleures estimations GIEC AR6 GT1, RID (SSP1-1.9 1,4 ;
 *     SSP1-2.6 1,8 ; SSP2-4.5 2,7 ; SSP3-7.0 3,6 ; SSP5-8.5 4,4 °C).
 * Entre ces points, interpolation linéaire.
 */
export const SSP_WARMING_2100: Record<string, number> = {
  ssp119: 1.4,
  ssp126: 1.8,
  ssp245: 2.7,
  ssp370: 3.6,
  ssp585: 4.4,
};

const START = 1850;
const END = 2100;

function anomaly(year: number, end2090: number): number {
  if (year <= 1900) return 0;
  if (year <= 2015) return ((year - 1900) / 115) * 1.1;
  if (year >= 2090) return end2090;
  return 1.1 + ((year - 2015) / 75) * (end2090 - 1.1);
}

/** Échelle divergente bleu → rouge (0 à 4,5 °C), lisible en clair comme en sombre. */
const STOPS: Array<[number, [number, number, number]]> = [
  [0.0, [33, 102, 172]],
  [0.5, [103, 169, 207]],
  [1.0, [209, 229, 240]],
  [1.5, [253, 219, 199]],
  [2.5, [239, 138, 98]],
  [3.5, [178, 24, 43]],
  [4.5, [103, 0, 31]],
];

function colorFor(v: number): string {
  if (v <= STOPS[0][0]) return `rgb(${STOPS[0][1].join(',')})`;
  for (let i = 1; i < STOPS.length; i++) {
    const [x1, c1] = STOPS[i];
    const [x0, c0] = STOPS[i - 1];
    if (v <= x1) {
      const t = (v - x0) / (x1 - x0);
      const c = c0.map((a, k) => Math.round(a + (c1[k] - a) * t));
      return `rgb(${c.join(',')})`;
    }
  }
  return `rgb(${STOPS[STOPS.length - 1][1].join(',')})`;
}

export const WarmingStripes: React.FC<{
  scenario?: string;
  active?: boolean;
  className?: string;
  label: string;
}> = ({ scenario = 'ssp245', active = true, className = '', label }) => {
  const end = SSP_WARMING_2100[scenario] ?? 2.7;
  const stripes = useMemo(() => {
    const out: string[] = [];
    for (let y = START; y <= END; y += 2) out.push(colorFor(anomaly(y, end)));
    return out;
  }, [end]);
  const gradient = stripes
    .map((c, i) => `${c} ${(i / stripes.length) * 100}% ${((i + 1) / stripes.length) * 100}%`)
    .join(', ');

  return (
    <div
      role="img"
      aria-label={label}
      title={label}
      className={`h-full w-full transition-[filter,opacity] duration-500 ${active ? '' : 'grayscale opacity-40'} ${className}`}
      style={{ backgroundImage: `linear-gradient(90deg, ${gradient})` }}
    />
  );
};
