import Link from 'next/link';
import LikeButton from '@/components/LikeButton';
import { notFound } from 'next/navigation';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/posts/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) return notFound();
  const post = await res.json();

  return (
    <main className="max-w-xl mx-auto py-8">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">← Back to posts</Link>
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="mb-4 text-gray-700">{post.body}</p>
      <LikeButton initialLikes={post.likes} postId={post.id} />
    </main>
  );
}
