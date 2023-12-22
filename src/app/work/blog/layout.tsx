import React from 'react';
import BackLink from '@/components/Common/BackLink';

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen p-2">
      <BackLink />
      {children}
    </div>
  );
};

export default BlogLayout;
