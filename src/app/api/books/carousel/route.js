// src/app/api/books/carousel/route.js
import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    const jsonDirectory = path.join(process.cwd(), 'src', 'app', 'data');
    const fileContents = await fs.readFile(path.join(jsonDirectory, 'books.json'), 'utf8');
    const books = JSON.parse(fileContents);

    // Select 5 random books for the carousel
    const shuffled = books.sort(() => 0.5 - Math.random());
    const selectedBooks = shuffled.slice(0, 5);

    return NextResponse.json(selectedBooks);
  } catch (error) {
    console.error('Error fetching carousel books:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}