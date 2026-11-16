import { useState } from "react";
import type { CreatePostInput } from "../types/post";

interface PostFormProps {
  onCreatePost: (input: CreatePostInput) => Promise<void>;
}

export function PostForm({ onCreatePost }: PostFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!trimmedTitle || !trimmedBody) return;

    setIsSubmitting(true);
    try {
      await onCreatePost({ title: trimmedTitle, body: trimmedBody });
      setTitle("");
      setBody("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>Buat Post Baru</h2>
      <label>
        Judul Post
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul post..."
          required
        />
      </label>

      <label>
        Konten
        <textarea
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Isi post..."
          required
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Mengirim..." : "Kirim Post"}
      </button>
    </form>
  );
}
