'use client';
import React from 'react'
import Link from 'next/link'
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const Topbar: React.FC = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirectTo: "/" });
  };

  return (
    <header className="w-full bg-background p-4 flex items-center justify-between border-b border-border">
      <Link href="/" className="text-2xl font-bold text-primary">DevTrack</Link>
      <div className="flex items-center space-x-4">
        {session ? (
          <button
            onClick={handleLogout}
            className="text-primary hover:text-primary/80 transition bg-secondary px-3 py-1 rounded cursor-pointer"
          >
            Sign Out
          </button>
        ) : (
          <Link href="/signin" className="text-primary hover:text-primary/80 transition bg-secondary px-3 py-1 rounded cursor-pointer">
            Sign In
          </Link>
        )}
      </div>
    </header>
  )
}

export default Topbar
