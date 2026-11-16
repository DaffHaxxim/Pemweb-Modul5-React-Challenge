export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
}

export type NewNote = Omit<Note, "id">;
