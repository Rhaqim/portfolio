import BlogType from '@/types/blog.type';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const postsData = await import('../../../../blog/posts.json');
  const posts: BlogType[] = postsData.default.map((post: any) => ({
    ...post,
    date: new Date(post.date),
  }));

  const post = posts.find((post) => post.id === params.id);

  if (!post) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(JSON.stringify(post), {
    headers: {
      'content-type': 'application/json',
    },
  });
}
