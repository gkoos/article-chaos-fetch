

import PostView from '@/components/PostView';
export default function PostPage({ params }: { params: { id: string } }) {
  // Pass postId as number to PostView, which now fetches the post itself
  const id = typeof params.id === 'string' ? parseInt(params.id, 10) : params.id;
  return <PostView postId={id} />;
}
