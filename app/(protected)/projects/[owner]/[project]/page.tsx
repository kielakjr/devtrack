import { getRepoFull } from '@/lib/github';
import RepoFullView from '@/components/project/ProjectFullView';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ owner: string; project: string }>;
}

async function RepoData({ owner, project }: { owner: string; project: string }) {
  try {
    const data = await getRepoFull(owner, project);
    return <RepoFullView repo={data} />;
  } catch {
    notFound();
  }
}

export default async function RepoPage({ params }: PageProps) {
  const { owner, project } = await params;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Suspense fallback={<p className="text-text text-center">Loading repository details...</p>}>
        <RepoData owner={owner} project={project} />
      </Suspense>
    </div>
  );
}
