'use client';
import React, { use } from 'react'
import Link from 'next/link'
import { useSession } from "next-auth/react";
import { logout } from "@/lib/auth";

const Topbar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <header className="w-full bg-background p-4 flex items-center justify-between border-b border-border">
      <Link href="/" className="text-2xl font-bold text-primary">DevTrack</Link>
      <div className="flex items-center space-x-4">
        {session ? (
          <button
            onClick={logout}
            className="text-primary hover:text-primary/80 transition bg-secondary px-3 py-1 rounded"
          >
            Sign Out
          </button>
        ) : (
          <Link href="/signin" className="text-primary hover:text-primary/80 transition bg-secondary px-3 py-1 rounded">
            Sign In
          </Link>
        )}
      </div>
    </header>
  )
}

export default Topbar
