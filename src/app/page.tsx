
import Link from 'next/link';

export default async function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/posts`, { cache: 'no-store' });
  const posts = await res.json();
  return (
    <main className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Recipes</h1>
      <ul className="space-y-4">
        {posts.map((post: { id: string; title: string }) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`} className="text-blue-600 hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
