'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Articles from '@/types/article.type';
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
    <div
      id="blog"
      className="flex flex-col items-center justify-start min-h-screen py-4"
    >
      <h1 className="text-4xl font-bold mb-4">Blog Posts</h1>
      {/* Posts */}
      <ul>
        {blogPosts.map((post) => (
          <li
            key={post.id}
            className="mb-4 w-full flex justify-between border-b-2 border-gray-300 pb-2 hover:scale-105 transition duration-300 ease-in-out"
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
    </div>
  );
};

export default Blog;
