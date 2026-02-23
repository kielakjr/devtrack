import { getCourses } from '@/lib/courses';
import Courses from '@/components/course/Courses';

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-primary">Courses</h1>
      <Courses initialCourses={courses} />
    </div>
  );
}
