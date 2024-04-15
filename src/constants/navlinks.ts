export const getFilteredNavLinks = (
  layout: 'work' | 'blog' | 'resume' | 'projects' | 'experience',
) => {
  // Omit links based on the provided layout
  const shouldIncludeLink = (link: { href: string; label: string }) => {
    switch (layout) {
      case 'work':
        return link.href !== '#work-experience';
      case 'blog':
        return link.href !== '#blog';
      case 'resume':
        return link.href !== '#resume';
      default:
        return true;
    }
  };

  return workNavLinks.filter(shouldIncludeLink);
};

export const workNavLinks = [
  { href: '/', label: 'Home' },
  { href: '#work-experience', label: 'Work' },
  { href: '#blog', label: 'Blog' },
  { href: '#resume', label: 'Resume' },
  { href: '#contact', label: 'Contact' },
];

export const gameNavLinks = [
  { href: '/game/start', label: 'Start' },
  { href: '/', label: 'Home' },
  { href: '/game/credit', label: 'Credit' },
  { href: '/work/contact', label: 'Contact' },
];
