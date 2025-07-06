import { NextResponse } from 'next/server';
import adaptations from '@/app/data/adaptations.json';

export async function GET() {
  try {
    // In a real scenario, you might fetch this data from a database or an external API.
    // For this example, we're directly importing the JSON file.
    // Ensure the path to adaptations.json is correct.
    return NextResponse.json({ data: adaptations }, { status: 200 });
  } catch (error) {
    console.error("Failed to load adaptations data:", error);
    return NextResponse.json(
      { message: "Error fetching adaptations data", error: error.message },
      { status: 500 }
    );
  }
}
