
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import LikeButton from './LikeButton';

type Post = { id: string, title: string, body: string, likes: number };

export default function PostView({ postId }: { postId: number }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/posts/${postId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch post');
        const data = await res.json();
        setPost(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) return <main className="max-w-xl mx-auto py-8">Loading...</main>;
  if (error || !post) return <main className="max-w-xl mx-auto py-8">Error: {error || 'Post not found'}</main>;

  return (
    <main className="max-w-xl mx-auto py-8">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">← Back to posts</Link>
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="mb-4 text-gray-700">{post.body}</p>
      <LikeButton initialLikes={post.likes} postId={post.id} />
    </main>
  );
}
