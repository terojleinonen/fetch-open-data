export type EntityRef = {
  name : string;
  title: string;
  url?: string;
};

export type Book = {
  id: number;
  year: number;
  title: string;
  handle: string;
  publisher: string;
  isbn: string;
  pages: number;
  notes?: string[];
  description: string;
  cover: any;
  categories: string[];
  villains?: EntityRef[];
};

export type Villain = {
  id: number;
  name: string;
  gender: string;
  status: "UNKNOWN" | "ALIVE" | "DECEASED" | "MISSING" | "UNDEAD" | "OTHER" | "DEAD" | string; // can evolve later
  types_id: number;
  notes?: string[];
  created_at: string;
  books?: EntityRef[];
  shorts?: EntityRef[];
};

export type Short = {
  id: number;
  title: string;
  type: "Short Story" | "Novella" | "Novelette" | "Poem";
  originallyPublishedIn: string;
  collectedIn: string;
  notes?: string[];
  year: number;
  villains?: EntityRef[]; // villains
};