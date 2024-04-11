'use client';

// InteractiveBlog.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { Article } from '@/types/article.type';
import { getArticle } from '@/service/devto/routes';

const InteractiveBlog: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [article, setBlogPost] = useState<Article>();
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState<number>(0);

  const handleCommentSubmit = () => {
    if (newComment.trim() !== '') {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  useEffect(() => {
    const id = encodeURIComponent(params.id);

    const fetchPost = async () => {
      try {
        const post = await getArticle(id);
        setBlogPost(post.data as Article);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPost();
  }, [params.id]);

  if (!article) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold">{article.title}</h2>

      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-gray-200 p-8 w-full rounded-md shadow-md text-black"
      >
        <div className="mx-auto p-4">
          <p className="text-gray-600 mb-4">{article.description}</p>
          <div className="flex justify-between mb-4">
            <p className="text-sm text-gray-500">
              {article.readable_publish_date}
            </p>
            <p className="text-sm text-gray-500">{article.user.name}</p>
          </div>
          {/* <Image
            src={article.cover_image}
            alt={article.title}
            className="w-full h-auto mb-4"
          /> */}
          <div dangerouslySetInnerHTML={{ __html: article.body_html }} />
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveBlog;
