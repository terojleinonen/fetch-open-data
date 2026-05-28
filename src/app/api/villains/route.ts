import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [ villainsRes ] = await Promise.all([
      fetch("https://stephen-king-api.onrender.com/api/villains"),
    ]);
    if (!villainsRes.ok) {
      throw new Error(`HTTP ${villainsRes.status} fetching villains`);
    }

    const villainsJson = await villainsRes.json();
    const villains = villainsJson.data || [];

    const formattedVillains = villains.map((v: any) => {

      return {
        id: v.id,
        name: v.name,
        status: v.status,
        gender: v.gender,
        types_id: v.types_id,
        notes: v.notes || [],
        created_at: v.created_at,
        books: v.books || [],
        shorts: v.shorts || [],
      };
    });
    return NextResponse.json({ villains: formattedVillains });
  } catch (err) {
    console.error(err);

    return NextResponse.json({ villains: [] }, { status: 500 });
  }
}