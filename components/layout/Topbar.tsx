import React from 'react'

const Topbar: React.FC = () => {
  return (
    <header className="w-full bg-background p-4 flex items-center justify-between border-b border-border">
      <h1 className="text-2xl font-bold">DevTrack</h1>
      <div className="flex items-center space-x-4">
        <button className="px-3 py-1 bg-primary text-background rounded">Login</button>
        <button className="px-3 py-1 bg-secondary text-primary rounded">Sign Up</button>
      </div>
    </header>
  )
}

export default Topbar
