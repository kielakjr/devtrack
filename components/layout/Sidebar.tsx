import React from 'react'
import NavLink from '@/components/ui/NavLink';

const Sidebar: React.FC = () => {

  return (
    <aside className="w-64 bg-background p-4 border-r border-border mt-0 shrink-0">
      <nav className="space-y-2">
        <NavLink href="/dashboard">Dashboard</NavLink>
        <NavLink href="/projects">Projects</NavLink>
        <NavLink href="/repos">Repos</NavLink>
        <NavLink href="/settings">Settings</NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
