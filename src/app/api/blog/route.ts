import BlogType from '@/app/work/blog/blog.type';

export async function GET(req: Request) {
  const postsData = await import('../../../blog/posts.json');
  const posts: BlogType[] = postsData.default.map((post: any) => ({
    ...post,
    date: new Date(post.date),
  }));

  return new Response(JSON.stringify(posts), {
    headers: {
      'content-type': 'application/json',
    },
  });
}
