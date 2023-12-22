'use client';

import { GithubLogo, TwitterLogo, InstagramLogo } from '@phosphor-icons/react';
import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="container mx-auto min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Contact</h1>

      <div className="mb-4">
        <p className="font-bold">Contact via:</p>
        <div>
          <InstagramLogo className="inline-block w-6 h-6 mr-2" />
          <a
            href="https://www.linkedin.com/in/john-franklin-anusiem-104692166/"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-2"
          >
            LinkedIn
          </a>
          <GithubLogo className="inline-block w-6 h-6 mr-2" />
          <a
            href="https://github.com/rhaqim"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-2"
          >
            GitHub
          </a>
          <TwitterLogo className="inline-block w-6 h-6 mr-2" />
          <a
            href="https://twitter.com/alaswadkhan"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 font-bold">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-bold">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block mb-2 font-bold">
            Message
          </label>
          <textarea
            id="message"
            rows={6}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            value={message}
            onChange={handleMessageChange}
          ></textarea>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
