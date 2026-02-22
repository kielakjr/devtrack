import { getRepoFull } from '@/lib/github';
import RepoFullView from '@/components/ui/RepoFullView';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ owner: string; project: string }>;
}

export default async function RepoPage({ params }: PageProps) {
  const { owner, project } = await params;
  const data = await getRepoFull(owner, project);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Suspense fallback={<p>Loading repository details...</p>}>
        <RepoFullView repo={data} />
      </Suspense>
    </div>
  );
}
