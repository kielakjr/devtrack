'use server';
import Repos from "@/components/ui/Repos";
import { Suspense } from "react";

export default async function ReposPage() {
  return (
    <div className="flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-4">Repos</h1>
      <Suspense fallback={<p>Loading repositories...</p>}>
        <Repos />
      </Suspense>
    </div>
  )
}
