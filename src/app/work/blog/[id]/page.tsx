'use client';

// InteractiveBlog.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import BlogType from '../blog.type';
import Image from 'next/image';

interface CommentType {
  id: string;
  user?: string;
  content: string;
}

const InteractiveBlog: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [blogPost, setBlogPost] = useState<BlogType>();
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = () => {
    if (newComment.trim() !== '') {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  useEffect(() => {
    // const fetchComments = async () => {
    //   const response = await fetch(`/api/blog/${params.id}/comments`);
    //   const comments = await response.json();

    //   setComments(comments);
    // };
    // fetchComments();

    const id = encodeURIComponent(params.id);

    const fetchPost = async () => {
      const response = await fetch(`/api/blog/${id}`);
      const post = await response.json();

      setBlogPost(post);
    };
    fetchPost();
  }, [params.id]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">{blogPost?.title}</h1>

      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-gray-200 p-8 w-full rounded-md shadow-md text-black"
      >
        <p>
          {blogPost?.sections.map((paragraph, index) => (
            <div key={index} className="mb-4">
              {paragraph.images && (
                <div className="flex justify-center items-center">
                  <Image
                    className="mb-4"
                    src={paragraph.images[0].url}
                    alt={paragraph.images[0].alt}
                  />
                </div>
              )}

              <h1 className="font-bold text-center">{paragraph.header}</h1>
              <p>{paragraph.content}</p>
            </div>
          ))}
        </p>

        {/* Gamified Element */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="mt-4 p-4 bg-blue-500 w-[190px] text-white cursor-pointer items-center"
        >
          <p>Clap for this post! 👏</p>
        </motion.div>

        {/* Comment Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Comments</h3>
          <ul>
            {comments.map((comment, index) => (
              <li key={index} className="mb-2">
                {comment}
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Add a comment..."
            />
            <button
              onClick={handleCommentSubmit}
              className="mt-2 bg-blue-500 text-white p-2 rounded"
            >
              Submit Comment
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveBlog;
