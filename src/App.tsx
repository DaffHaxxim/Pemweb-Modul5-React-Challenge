import { useEffect, useState } from "react";
import { NoteCard } from "./components/NoteCard";
import { NoteForm } from "./components/NoteForm";
import { PostCard } from "./components/PostCard";
import { PostForm } from "./components/PostForm";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { createPost, deletePost, getPosts } from "./services/postService";
import type { NewNote, Note } from "./types/note";
import type { CreatePostInput, Post } from "./types/post";

type ActiveTab = "notes" | "posts";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("notes");

  // Tahap 1: Catatan Lokal + localStorage
  const [notes, setNotes] = useLocalStorage<Note[]>("modul5-notes", []);
  const [noteSearch, setNoteSearch] = useState("");

  // Tahap 2: Posts REST API
  const [posts, setPosts] = useState<Post[]>([]);
  const [postSearch, setPostSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPosts(postSearch, controller.signal);
        setPosts(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadPosts();
    return () => controller.abort();
  }, [postSearch]);

  const handleAddNote = (newNote: NewNote) => {
    const note: Note = { id: Date.now(), ...newNote };
    setNotes((prev) => [note, ...prev]);
  };

  const handleDeleteNote = (id: number) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const handleCreatePost = async (input: CreatePostInput) => {
    setError(null);
    try {
      const created = await createPost(input);
      setPosts((prev) => {
        const uniqueId = prev.some((p) => p.id === created.id)
          ? Date.now()
          : created.id;
        return [{ ...created, id: uniqueId }, ...prev];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat post");
      throw err;
    }
  };

  const handleDeletePost = async (id: number) => {
    setError(null);
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus post");
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(noteSearch.trim().toLowerCase()),
  );

  return (
    <main className="container">
      <header className="header">
        <h1>Modul 5 - Challenge Praktikum</h1>
        <nav className="tabs">
          <button
            type="button"
            className={activeTab === "notes" ? "tab active" : "tab"}
            onClick={() => setActiveTab("notes")}
          >
            Tahap 1: Catatan Lokal
          </button>
          <button
            type="button"
            className={activeTab === "posts" ? "tab active" : "tab"}
            onClick={() => setActiveTab("posts")}
          >
            Tahap 2: Posts REST API
          </button>
        </nav>
      </header>

      {activeTab === "notes" ? (
        <section className="stack">
          <NoteForm onAddNote={handleAddNote} />

          <div className="panel">
            <label>
              Cari Catatan (berdasarkan judul)
              <input
                type="search"
                value={noteSearch}
                onChange={(e) => setNoteSearch(e.target.value)}
                placeholder="Ketik judul catatan..."
              />
            </label>
          </div>

          {filteredNotes.length === 0 ? (
            <p className="status">Belum ada catatan yang sesuai.</p>
          ) : (
            <div className="stack">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="stack">
          <PostForm onCreatePost={handleCreatePost} />

          <div className="panel">
            <label>
              Cari Post di Server (query)
              <input
                type="search"
                value={postSearch}
                onChange={(e) => setPostSearch(e.target.value)}
                placeholder="Ketik kata kunci post..."
              />
            </label>
          </div>

          {error && <p className="error">Error: {error}</p>}

          {isLoading ? (
            <p className="status">Memuat posts...</p>
          ) : posts.length === 0 ? (
            <p className="status">Tidak ada post ditemukan.</p>
          ) : (
            <div className="stack">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
