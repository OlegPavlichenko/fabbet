export type Match = {
  id: number;
  league: string;
  home_team: string;
  away_team: string;
  kickoff: string; // ISO
  odds_home?: number;
  odds_draw?: number;
  odds_away?: number;
};

export type Prediction = {
  match_id: number;
  pick: 'HOME'|'DRAW'|'AWAY';
  confidence: number; // 0..1
};

// Naive baseline: lowest odds => pick; confidence ~ 1/odds clamped
export function predict(match: Match): Prediction {
  const { odds_home, odds_draw, odds_away } = match;
  const odds = [
    { k: 'HOME' as const, v: odds_home ?? 3 },
    { k: 'DRAW' as const, v: odds_draw ?? 3 },
    { k: 'AWAY' as const, v: odds_away ?? 3 },
  ];
  odds.sort((a,b)=>a.v-b.v);
  const best = odds[0];
  const conf = Math.max(0.4, Math.min(0.8, 1 / best.v));
  return { match_id: match.id, pick: best.k, confidence: +conf.toFixed(2) };
}
