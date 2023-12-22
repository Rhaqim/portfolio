'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

interface DropdownProps {
  buttonContent?: React.JSX.Element;
  children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ buttonContent, children }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownClick = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        open &&
        dropdownRef.current &&
        !document.getElementById('options-menu')?.contains(event.target as Node)
      ) {
        const isChild = Array.from(dropdownRef.current.childNodes).some(
          (child) => child.contains(event.target as Node),
        );
        if (!isChild) {
          setOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [open]);

  return (
    <div className="relative w-[85%]" ref={dropdownRef}>
      <button
        type="button"
        className={`inline-flex justify-center w-full`}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : 'false'}
        onClick={handleDropdownClick}
      >
        {buttonContent}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.8 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.8 }}
            transition={{ duration: 0.5 }}
            className="origin-center mt-2 w-full px-2 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
            role="menu"
            id="options-menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="py-1 w-full" role="none">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
