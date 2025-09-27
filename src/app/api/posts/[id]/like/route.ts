import { NextResponse } from 'next/server';
import { posts } from '../../data';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = posts.find(p => p.id === id);
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  post.likes++;
  return NextResponse.json({ likes: post.likes });
}
