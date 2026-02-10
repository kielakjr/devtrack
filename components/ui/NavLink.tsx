'use client';
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  const pathname = usePathname();
  return (
    <Link href={href} className={`block px-3 py-2 rounded hover:bg-secondary ${pathname === href ? 'bg-secondary' : ''}`}>
      {children}
    </Link>
  )
}

export default NavLink
