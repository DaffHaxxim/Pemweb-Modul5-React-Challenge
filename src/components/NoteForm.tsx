import { useState } from "react";
import type { NewNote } from "../types/note";

interface NoteFormProps {
  onAddNote: (note: NewNote) => void;
}

const CATEGORIES = ["Kuliah", "Tugas", "Pribadi"];

export function NoteForm({ onAddNote }: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) return;

    onAddNote({
      title: trimmedTitle,
      content: trimmedContent,
      category,
    });

    setTitle("");
    setContent("");
    setCategory(CATEGORIES[0]);
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>Tambah Catatan</h2>
      <label>
        Judul
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul catatan..."
          required
        />
      </label>

      <label>
        Kategori
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </label>

      <label>
        Isi Catatan
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tulis isi catatan..."
          required
        />
      </label>

      <button type="submit">Simpan Catatan</button>
    </form>
  );
}
