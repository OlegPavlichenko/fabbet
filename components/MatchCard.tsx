type Match = {
  id: number; league: string; home_team: string; away_team: string; kickoff: string;
  odds_home?: number; odds_draw?: number; odds_away?: number;
};
export default function MatchCard({ m, onPick }: { m: Match; onPick: (id:number)=>void }){
  return (
    <div className="rounded-2xl border p-4 shadow-sm space-y-2">
      <div className="text-xs uppercase opacity-60">{m.league}</div>
      <div className="text-lg font-semibold">{m.home_team} vs {m.away_team}</div>
      <div className="text-sm opacity-70">{new Date(m.kickoff).toLocaleString()}</div>
      <div className="text-sm">Кэфы: {m.odds_home ?? '-'} / {m.odds_draw ?? '-'} / {m.odds_away ?? '-'}</div>
      <button onClick={()=>onPick(m.id)} className="px-3 py-1 rounded-xl border hover:bg-black/5">Прогноз</button>
    </div>
  );
}
