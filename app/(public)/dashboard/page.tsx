'use client';
import { login } from "@/lib/auth";

export default function Dashboard() {

  const handleLogin = async () => {
    await login();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to the Dashboard!</h1>
      <p className="mt-4 text-lg">This is the dashboard page.</p>
      <button
        onClick={handleLogin}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Login with GitHub
      </button>
    </main>
  );
}
