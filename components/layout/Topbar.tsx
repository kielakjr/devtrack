'use server';
import React from 'react'
import Link from 'next/link'
import { getUserName } from "@/lib/auth";
import { auth } from '@/auth';

const Topbar: React.FC = async () => {
  const session = await auth();

  return (
    <header className="w-full bg-background p-4 flex items-center justify-between border-b border-border">
      <Link href="/" className="text-2xl font-bold text-primary">DevTrack</Link>
      <div className="flex items-center space-x-4">
        {session ? (
          <Link href="/profile" className="font-bold text-primary">Hi, {getUserName()} !</Link>
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
