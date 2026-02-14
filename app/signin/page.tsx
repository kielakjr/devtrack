'use client';
import { login } from "@/lib/auth";
import GitHubLogo from "@/components/ui/GitHubLogo";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In to DevTrack</h2>
        <button
          onClick={login}
          className="w-full flex items-center justify-center space-x-2 bg-primary text-background px-4 py-2 rounded hover:bg-primary/90 transition"
        >
          <GitHubLogo />
          <span>Sign in with GitHub</span>
        </button>
      </div>
    </div>
  );
}
