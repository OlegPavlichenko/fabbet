import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { predict } from "@/lib/predict";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest){
  const { match_id } = await req.json();
  const { rows } = await query(`select * from public.matches where id=$1`, [match_id]);
  if(!rows[0]) return NextResponse.json({ error:"Not found" }, { status:404 });
  const p = predict(rows[0]);
  return NextResponse.json({ prediction: p });
}
