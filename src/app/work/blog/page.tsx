'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import BlogType from '../../../types/blog.type';
import Link from 'next/link';
import { ArrowElbowRight } from '@phosphor-icons/react';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogType[]>([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const response = await fetch('/api/blog');
      const posts = await response.json();

      setBlogPosts(posts);
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
                  <p>{post.excerpt}</p>
                  <p className="text-gray-500 mt-2">
                    {new Date(post.date).toLocaleDateString()}
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
