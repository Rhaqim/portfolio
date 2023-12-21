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
      default:
        return true;
    }
  };

  return workNavLinks.filter(shouldIncludeLink);
};

export const workNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/work/blog', label: 'Blog' },
  { href: '/work/resume', label: 'Resume' },
  { href: '/work/contact', label: 'Contact' },
];

export const gameNavLinks = [
  { href: '/game/start', label: 'Start' },
  { href: '/', label: 'Home' },
  { href: '/game/credit', label: 'Credit' },
  { href: '/work/contact', label: 'Contact' },
];
