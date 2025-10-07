'use client'
import { useEffect, useState } from 'react'
import MatchCard from '@/components/MatchCard'

export default function Matches(){
  const [matches, setMatches] = useState<any[]>([])
  useEffect(()=>{
    fetch('/api/matches', { cache: 'no-store' })
      .then(r=>r.json())
      .then(d=>setMatches(d.matches||[]))
      .catch(()=>setMatches([]))
  }, [])

  const onPick = async (id:number) => {
    await fetch('/api/predict', { method:'POST', headers: { 'content-type':'application/json' }, body: JSON.stringify({ match_id:id }) })
      .then(r=>r.json())
      .then(d=>{
        if(d?.prediction){
          alert(`Прогноз: ${d.prediction.pick} (уверенность ${(d.prediction.confidence*100).toFixed(0)}%)`)
        } else {
          alert('Ошибка прогноза')
        }
      })
      .catch(()=>alert('Ошибка запроса'))
  }

  return (
    <main className="p-4 space-y-3">
      <h2 className="text-xl font-semibold">Матчи</h2>
      <div className="grid gap-3">
        {matches.map(m => <MatchCard key={m.id} m={m} onPick={(id)=>onPick(id)} />)}
      </div>
    </main>
  );
}
