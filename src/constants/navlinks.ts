export const getFilteredNavLinks = (
  layout: 'work' | 'blog' | 'resume' | 'projects' | 'experience',
) => {
  // Omit links based on the provided layout
  const shouldIncludeLink = (link: { href: string; label: string }) => {
    switch (layout) {
      case 'work':
        return link.href !== '/work';
      case 'blog':
        return link.href !== '/work/blog';
      case 'resume':
        return link.href !== '/work/resume';
      case 'projects':
        return link.href !== '/work/projects';
      case 'experience':
        return link.href !== '/work/experience';
      default:
        return true;
    }
  };

  return navLinks.filter(shouldIncludeLink);
};

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/work/blog', label: 'Blog' },
  { href: '/work/resume', label: 'Resume' },
  { href: '/work/projects', label: 'Projects' },
  { href: '/work/experience', label: 'Experience' },
  { href: '/work/contact', label: 'Contact' },
];
