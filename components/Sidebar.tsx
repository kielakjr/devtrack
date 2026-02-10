import React from 'react'

const Sidebar = () => {
  return (
    <aside className="w-64 bg-background p-4 border-r border-border mt-0">
      <nav className="space-y-2">
        <a href="#" className="block px-3 py-2 rounded hover:bg-secondary">Dashboard</a>
        <a href="#" className="block px-3 py-2 rounded hover:bg-secondary">Projects</a>
        <a href="#" className="block px-3 py-2 rounded hover:bg-secondary">Teams</a>
        <a href="#" className="block px-3 py-2 rounded hover:bg-secondary">Settings</a>
      </nav>
    </aside>
  )
}

export default Sidebar
