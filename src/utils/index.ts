const navLinks = [
  { href: '/home', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/life', label: 'Life' },
  { href: '/balance', label: 'Balance' },
];

export const navLinksList = (layout: 'work' | 'life' | 'balance') => {
  // check layout if the layout is work, life or balance, omit the corresponding link
  const omitLink = (link: { href: string; label: string }) => {
    if (layout === 'work' && link.href === '/work') return false;
    if (layout === 'life' && link.href === '/life') return false;
    if (layout === 'balance' && link.href === '/balance') return false;
    return true;
  };
  return navLinks.filter(omitLink);
};
