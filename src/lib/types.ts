export type EntityRef = {
  id?: number;
  name : string;
  title?: string;
  url?: string;
};

export type Book = {
  id: number;
  year: number;
  title: string;
  handle?: string;
  publisher: string;
  isbn: string;
  pages?: number;
  pageCount?: number;
  notes?: string[];
  description: string;
  cover: any;
  categories: string[];
  villains?: EntityRef[];
  stableId?: string;
};

export type Villain = {
  id: number;
  name: string;
  gender: string;
  status: "UNKNOWN" | "ALIVE" | "DECEASED" | "MISSING" | "UNDEAD" | "OTHER" | "DEAD" | string;
  types_id: number;
  notes?: string[];
  created_at: string;
  books?: EntityRef[];
  shorts?: EntityRef[];
  image?: string;
  location?: string;
  type?: string;
  category?: string;
};

export type Short = {
  id: number;
  title: string;
  type: "Short Story" | "Novella" | "Novelette" | "Poem" | string;
  originallyPublishedIn: string | null;
  collectedIn: string | null;
  notes?: string[];
  year: number | null;
  villains?: EntityRef[];
};
