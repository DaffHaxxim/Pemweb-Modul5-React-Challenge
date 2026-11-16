import type { Post } from "../types/post";

interface PostCardProps {
  post: Post;
  onDelete: (id: number) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  return (
    <article className="card">
      <div className="card-header">
        <div>
          <span className="badge">Post #{post.id}</span>
          <h3>{post.title}</h3>
        </div>
        <button
          type="button"
          className="btn-danger"
          onClick={() => onDelete(post.id)}
        >
          Hapus
        </button>
      </div>
      <p>{post.body}</p>
    </article>
  );
}
