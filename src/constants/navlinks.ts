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

  return workNavLinks.filter(shouldIncludeLink);
};

export const workNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/work/blog', label: 'Blog' },
  { href: '/work/resume', label: 'Resume' },
  { href: '/work/projects', label: 'Projects' },
  { href: '/work/experience', label: 'Experience' },
  { href: '/work/contact', label: 'Contact' },
];

export const gameNavLinks = [
  { href: '/game/start', label: 'Start' },
  { href: '/', label: 'Home' },
  { href: '/game/credit', label: 'Credit' },
  { href: '/game/contact', label: 'Contact' },
];
