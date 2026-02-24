import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import GitHubLogo from '@/components/github/GitHubLogo';
import Feature from '@/components/ui/Feature';

export default async function Home() {
  const session = await auth();
  if (session) redirect('/dashboard');

  return (
    <div className="min-h-[calc(100vh-57px)] flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold text-primary tracking-tight">
            Track your
            <br />
            <span className="text-primary/60">dev journey</span>
          </h1>

          <p className="text-lg text-text max-w-lg mx-auto">
            Sessions, projects, courses, goals — all in one place.
            Build consistency and see your progress over time.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/signin"
              className="px-6 py-3 bg-primary text-background rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors"
            >
              <GitHubLogo className="mr-2 inline-block" />
              Get started with GitHub
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs uppercase tracking-wider text-text/50 text-center mb-12">
            Everything you need
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Feature
              title="Study Sessions"
              description="Track coding, learning and debugging time. See your daily streak and activity heatmap."
            />
            <Feature
              title="GitHub Projects"
              description="Import repos directly from GitHub. See commits, languages, branches and contributors."
            />
            <Feature
              title="Course Tracking"
              description="Track your progress through online courses. Log time spent and see completion percentage."
            />
            <Feature
              title="Goals & Notes"
              description="Set goals with deadlines for each project. Add notes to keep track of ideas and progress."
            />
            <Feature
              title="Activity Graph"
              description="GitHub-style heatmap for your study sessions. Visualize your consistency at a glance."
            />
            <Feature
              title="Dashboard"
              description="See everything that matters — today's stats, active courses, upcoming goals, recent sessions."
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-2xl font-bold text-primary">Built for developers who learn</h2>
          <p className="text-text max-w-lg mx-auto">
            Whether you're grinding LeetCode, building side projects, or working through
            a course — DevTrack helps you stay consistent and measure your growth.
          </p>

          <div className="border border-border rounded-lg p-6 text-left space-y-4">
            <div className="flex items-baseline gap-4 text-xs text-text">
              <span><span className="text-primary font-medium">12h 45m</span> total</span>
              <span><span className="text-primary font-medium">8</span> active days</span>
              <span><span className="text-primary font-medium">23</span> sessions</span>
            </div>

            <div className="flex gap-1 h-6">
              {[0,0,1,0,2,3,0,1,0,0,4,2,0,0,1,3,4,0,0,2,1,0,0,0,3,2,1,0,4,0,0,1].map((level, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm ${
                    ['bg-secondary/30', 'bg-primary/20', 'bg-primary/40', 'bg-primary/65', 'bg-primary'][level]
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] text-text/40 mr-1">Less</span>
              {['bg-secondary/30', 'bg-primary/20', 'bg-primary/40', 'bg-primary/65', 'bg-primary'].map((c, i) => (
                <div key={i} className={`size-2.5 rounded-sm ${c}`} />
              ))}
              <span className="text-[10px] text-text/40 ml-1">More</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 text-center">
        <h2 className="text-xl font-bold text-primary mb-3">Start tracking today</h2>
        <p className="text-sm text-text mb-6">Free. Open source. Sign in with GitHub.</p>
        <Link
          href="/signin"
          className="px-6 py-3 bg-primary text-background rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors"
        >
          <GitHubLogo className="mr-2 inline-block" /> Sign in with GitHub
        </Link>
      </section>

      <footer className="border-t border-border px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-text/30">
          <span>DevTrack</span>
          <span>Built with Next.js, Prisma & GitHub API</span>
        </div>
      </footer>
    </div>
  );
}
