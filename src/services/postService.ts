import type { CreatePostInput, Post } from "../types/post";

// Fallback API publik sesuai Modul 5; ganti ke "http://localhost:3000/api/posts"
// jika backend Express + Neon dari Modul 4 dijalankan secara lokal.
const API_URL = "https://jsonplaceholder.typicode.com/posts";

export async function getPosts(search = "", signal?: AbortSignal): Promise<Post[]> {
  const params = new URLSearchParams({ _limit: "10" });
  const keyword = search.trim();
  if (keyword) {
    params.set("q", keyword);
  }

  const res = await fetch(`${API_URL}?${params.toString()}`, { signal });
  if (!res.ok) {
    throw new Error(`Gagal memuat posts (HTTP ${res.status})`);
  }

  return (await res.json()) as Post[];
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, userId: 1 }),
  });

  if (!res.ok) {
    throw new Error(`Gagal membuat post (HTTP ${res.status})`);
  }

  return (await res.json()) as Post;
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`Gagal menghapus post (HTTP ${res.status})`);
  }
}
