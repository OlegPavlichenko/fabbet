import MatchCard from "@/components/MatchCard";

async function getMatches(){
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const res = await fetch(`${base}/api/matches`, { cache: "no-store" });
  const data = await res.json();
  return data.matches as any[];
}

export default async function Matches(){
  const matches = await getMatches();

  async function pick(id:number){
    "use server";
    await fetch("/api/predict", { method:"POST", body: JSON.stringify({ match_id:id }) });
  }

  return (
    <main className="p-4 space-y-3">
      <h2 className="text-xl font-semibold">Матчи</h2>
      <div className="grid gap-3">
        {matches?.map(m => <MatchCard key={m.id} m={m} onPick={(id)=>pick(id)} />)}
      </div>
    </main>
  );
}
