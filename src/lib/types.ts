export type EntityRef = { id?: number; name?: string; title?: string; url?: string };
export type Book = { id: number; title: string; year: number | null; publisher: string | null; isbn: string | null; pageCount: number | null; notes: string[]; description: string; cover: string | null; categories: string[]; villains: EntityRef[] };
export type Short = { id: number; title: string; year: number | null; type: string; originallyPublishedIn: string | null; collectedIn: string | null; notes: string[]; villains: EntityRef[] };
export type Villain = { id: number; name: string; gender: string; status: string; types_id: number | null; notes: string[]; created_at: string | null; books: EntityRef[]; shorts: EntityRef[] };
