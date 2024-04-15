'use client';

import React from 'react';

const Resume = () => {
  const file = '/docs/Profile.pdf';

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
    <div
      id="resume"
      className="flex items-center justify-start flex-col min-h-screen m-1 p-1 space-y-4"
    >
      <h1 className="text-4xl font-bold my-4">Resume</h1>
      <p className="text-lg text-center p-2 rounded-md shadow-lg border">
        Feel free to download my resume or view it in the browser. I am open to
        any opportunities you believe I may be a good fit for.
      </p>
      {/* Display resume */}
      <iframe
        src={file}
        width="100%"
        height="700px"
        title="Resume"
        className="mt-4 hidden md:block"
      />

      <div className="md:hidden flex flex-col justify-center items-center">
        <div className="flex flex-col w-full justify-evenly">
          <button
            className="mt-4 p-4 bg-blue-500 text-white cursor-pointer rounded-md"
            onClick={handleDownloadResume}
          >
            Download Resume
          </button>
          <button
            className="mt-4 p-4 bg-blue-500 text-white cursor-pointer rounded-md"
            onClick={handleViewResume}
          >
            View Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resume;
