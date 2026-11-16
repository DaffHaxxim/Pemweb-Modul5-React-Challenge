import type { Note } from "../types/note";

interface NoteCardProps {
  note: Note;
  onDelete: (id: number) => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  return (
    <article className="card">
      <div className="card-header">
        <div>
          <span className="badge">{note.category}</span>
          <h3>{note.title}</h3>
        </div>
        <button
          type="button"
          className="btn-danger"
          onClick={() => onDelete(note.id)}
        >
          Hapus
        </button>
      </div>
      <p>{note.content}</p>
    </article>
  );
}
