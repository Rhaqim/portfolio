import { useEffect, useRef } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import Wiki from './Wiki';

const sectionVariants: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const WorkTimeline: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    const handleScroll = () => {
      if (element && element.getBoundingClientRect().top < window.innerHeight) {
        controls.start('visible');
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [controls]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={sectionVariants}
        className="bg-blue-500 text-white p-8 mb-4"
      >
        <Wiki title="Work Timeline" content="This is the work timeline page" />
      </motion.div>
    </div>
  );
};

export default WorkTimeline;
