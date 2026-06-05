import { NextResponse } from "next/server";
const API_ROOT =  process.env.STEPHEN_KING_API?.replace(/\/$/, "");
const SK_API = `${API_ROOT}/api`;

export async function GET() {
  try {
    const res = await fetch(
      `${SK_API}/shorts`
    );

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    //console.log("Shorts API response:", json);


    const data = json.data || [];

    const shorts = data.map((s: any) => ({
      id: s.id,
      title: s.title || s.Title,
      year: s.year || null,
      type: s.type, 
      originallyPublishedIn: s.originallyPublishedIn || null,
      collectedIn: s.collectedIn || null,
      notes: s.notes || [],
      villains: s.villains || []
    }));

    return NextResponse.json({ shorts });
  } catch (err) {
    console.error("Shorts API failed:", err);

    return NextResponse.json(
      { shorts: [] },
      { status: 500 }
    );
  }
}