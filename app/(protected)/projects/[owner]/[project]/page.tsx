import { getRepoFull } from '@/lib/github';
import ProjectFullView from '@/components/project/ProjectFullView';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Goals from '@/components/goal/Goals';
import Notes from '@/components/note/Notes';
import { getGoals } from '@/lib/goals';
import { getNotes } from '@/lib/notes';
import { auth } from '@/auth';
import { isProjectOwner } from '@/lib/auth';
import { getProjectByGitHub } from '@/lib/projects';

interface PageProps {
  params: Promise<{ owner: string; project: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { owner, project: projectName } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const hasAccess = await isProjectOwner(owner, projectName);
  if (!hasAccess) notFound();

  const project = await getProjectByGitHub(owner, projectName);

  if (!project) notFound();

  const [repoData, goals, notes] = await Promise.all([
    getRepoFull(owner, projectName),
    getGoals(project.id),
    getNotes(project.id),
  ]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Suspense fallback={<p className="text-text text-center">Loading repository details...</p>}>
        <ProjectFullView repo={repoData} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title={`Goals (${goals.length})`}>
          <Goals projectId={project.id} initialGoals={goals} />
        </Section>

        <Section title={`Notes (${notes.length})`}>
          <Notes projectId={project.id} initialNotes={notes} />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-lg p-4">
      <h2 className="text-xs uppercase tracking-wider text-text mb-4">{title}</h2>
      {children}
    </div>
  );
}
