/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

const API_ROOT =  process.env.STEPHEN_KING_API?.replace(/\/$/, "");
const SK_API = `${API_ROOT}/api`;

export async function GET() {
  try {
    const [ villainsRes ] = await Promise.all([
      fetch(`${SK_API}/villains`),
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