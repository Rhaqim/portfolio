import Wiki from '@/components/Wiki';
import React from 'react';

const Timeline = () => {
  const timelineContent = [
    {
      title: 'Born',
      date: '1995-01-01',
      content: 'I was born in a small town in the middle of nowhere.',
      image: '/images/placeholder.png',
    },
    {
      title: 'First Steps',
      date: '1995-01-01',
      content: 'I was born in a small town in the middle of nowhere.',
      image: '/images/placeholder.png',
    },
    {
      title: 'First Words',
      date: '1995-01-01',
      content: 'I was born in a small town in the middle of nowhere.',
      image: '/images/placeholder.png',
    },
  ];

  return (
    <div>
      <div>
        {timelineContent.map((item) => (
          <div key={item.title}>
            <Wiki
              title={item.title}
              image={item.image}
              content={item.content}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
