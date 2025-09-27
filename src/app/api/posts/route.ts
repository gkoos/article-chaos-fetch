import { NextResponse } from 'next/server';
import { posts } from './data';

export async function GET() {
  // Only return id and title for the list
  return NextResponse.json(posts.map(({ id, title }) => ({ id, title })));
}
