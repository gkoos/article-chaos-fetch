"use client";
import { useState } from 'react';

export default function LikeButton({ initialLikes, postId }: { initialLikes: number, postId: string }) {
  const [likes, setLikes] = useState(initialLikes);
  const [pending, setPending] = useState(false);

  const handleLike = async () => {
    const prevLikes = likes;
    setLikes(likes + 1); // optimistic update
    setPending(true);
    try {
      // Call backend API
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to like');
      const data = await res.json();
      setLikes(data.likes); // sync likes from backend
    } catch {
      setLikes(prevLikes); // rollback on failure
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="text-red-500 text-2xl px-3 py-1 rounded-full border border-red-200 disabled:opacity-50"
        onClick={handleLike}
        disabled={pending}
        aria-label="Like"
      >
        ♥
      </button>
      <span className="text-lg">{likes} likes</span>
    </div>
  );
}
