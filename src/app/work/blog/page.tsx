'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Articles from '@/types/article.type';
import Link from 'next/link';
import { getArticles } from '@/service/devto/routes';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<Articles[]>([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const posts = await getArticles();
        setBlogPosts(posts.data as Articles[]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBlogPosts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Blog</h1>

      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="dark:bg-gray-200 p-2 w-full rounded-md shadow-md text-white bg-black dark:text-black min-h-screen"
      >
        <h2 className="text-2xl font-bold mb-4">Latest Posts</h2>

        {/* Posts */}
        <ul className="space-y-4 overflow-auto">
          {blogPosts.map((post) => (
            <li
              key={post.id}
              className="mb-4 flex justify-between items-center border-b-2 border-gray-300 pb-2"
            >
              <Link href={`/work/blog/${post.id}`} passHref>
                <div>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p>{post.title}</p>
                  <p className="text-gray-500 mt-2">
                    {new Date(post.published_timestamp).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default Blog;
