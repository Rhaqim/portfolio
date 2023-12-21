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
    <div>
      <h1>Resume</h1>
      <button onClick={handleDownloadResume}>Download Resume</button>
      <button onClick={handleViewResume}>View Resume</button>
    </div>
  );
};

export default Resume;
