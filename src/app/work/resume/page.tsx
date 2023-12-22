'use client';

import React from 'react';

const Resume = () => {
  const file = '/docs/profile.pdf';

  const handleDownloadResume = () => {
    // Logic to download the resume file
    window.open(file);
    const link = document.createElement('a');
    link.href = file;
    link.download = 'AnusiemJohnFranklinResume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewResume = () => {
    // Logic to view the resume file
    window.open(file);
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <h1 className="text-4xl font-bold mb-4">Resume</h1>
      {/* Display resume */}
      <iframe
        src={file}
        width="100%"
        height="700px"
        title="Resume"
        className="mt-4"
      />

      {/* <div className="flex w-full justify-evenly">
        <button
          className="mt-4 p-4 bg-blue-500 text-white cursor-pointer"
          onClick={handleDownloadResume}
        >
          Download Resume
        </button>
        <button
          className="mt-4 p-4 bg-blue-500 text-white cursor-pointer"
          onClick={handleViewResume}
        >
          View Resume
        </button>
      </div> */}
    </div>
  );
};

export default Resume;
