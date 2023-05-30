import { useEffect, useRef } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';

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

const SlidingSections: React.FC = () => {
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
        Section 1
      </motion.div>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={sectionVariants}
        className="bg-green-500 text-white p-8 mb-4"
      >
        Section 2
      </motion.div>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={sectionVariants}
        className="bg-red-500 text-white p-8"
      >
        Section 3
      </motion.div>
    </div>
  );
};

export default SlidingSections;
