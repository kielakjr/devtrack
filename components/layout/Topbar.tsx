import React from 'react'
import Link from 'next/link'

const Topbar: React.FC = () => {
  return (
    <header className="w-full bg-background p-4 flex items-center justify-between border-b border-border">
      <h1 className="text-2xl font-bold">DevTrack</h1>
      <div className="flex items-center space-x-4">
        <Link href="/login" className="px-3 py-1 bg-primary text-background rounded">Login</Link>
        <Link href="/register" className="px-3 py-1 bg-secondary text-primary rounded">Sign Up</Link>
      </div>
    </header>
  )
}

export default Topbar
