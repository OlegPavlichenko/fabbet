import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { predict } from "@/lib/predict";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { match_id } = await req.json();
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", match_id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Not found" }, { status: 404 });
  }

  const p = predict(data as any);
  return NextResponse.json({ prediction: p });
}
