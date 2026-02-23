import Sessions from '@/components/session/Sessions';
import { Suspense } from 'react';

export default async function SessionsPage() {

  return (
    <>
    <Suspense fallback={<div className="p-6">Loading sessions...</div>}>
      <Sessions />
    </Suspense>
    </>
  );
}
