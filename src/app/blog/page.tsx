'use client';

// InteractiveBlog.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GameThemedAnimations from '@/components/Anim/GameThemed';

const InteractiveBlog: React.FC = () => {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = () => {
    if (newComment.trim() !== '') {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Interactive Blog</h1>

      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-gray-200 p-8 rounded-md shadow-md text-black"
      >
        <h2 className="text-2xl font-bold mb-4">Latest Post</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac libero
          vel erat volutpat malesuada.
        </p>

        {/* Gamified Element */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="mt-4 p-4 bg-blue-500 text-white cursor-pointer"
        >
          Clap for this post! 👏
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

      <GameThemedAnimations />

      <div className="mt-8">
        <Canvas>
          {/* Your 3D models or graphics go here */}
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default InteractiveBlog;
