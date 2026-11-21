import { Link } from "react-router";
import { CheckCircle2, Circle, Clock, Pencil, PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { LessonProgressStatus } from "~/db/schema";
import { formatDuration, formatLessonCount } from "~/lib/utils";

type Lesson = {
  id: number;
  title: string;
  durationMinutes: number | null;
};

type CourseModule = {
  id: number;
  title: string;
  lessons: Lesson[];
};

type CourseRef = { id: number; slug: string };

type LessonAccess = {
  canView: boolean;
  isInstructor: boolean;
  lessonProgressMap: Record<number, string>;
};

type CourseContentProps = LessonAccess & {
  course: CourseRef & { modules: CourseModule[] };
};

export function CourseContent({ course, ...access }: CourseContentProps) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Course Content</h2>
      {course.modules.length === 0 ? (
        <p className="text-muted-foreground">
          No content has been added to this course yet.
        </p>
      ) : (
        <div className="space-y-4">
          {course.modules.map((mod) => (
            <ModuleCard key={mod.id} course={course} mod={mod} {...access} />
          ))}
        </div>
      )}
    </div>
  );
}

function ModuleCard({
  course,
  mod,
  ...access
}: LessonAccess & { course: CourseRef; mod: CourseModule }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">
          <Link
            to={`/courses/${course.slug}/${mod.id}`}
            className="hover:underline"
          >
            {mod.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">
          {formatLessonCount(mod.lessons.length)}
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {mod.lessons.map((lesson) => (
            <li key={lesson.id}>
              <LessonRow course={course} lesson={lesson} {...access} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

const ROW_LINK_CLASS =
  "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted";

function LessonRow({
  course,
  lesson,
  canView,
  isInstructor,
  lessonProgressMap,
}: LessonAccess & { course: CourseRef; lesson: Lesson }) {
  const details = (
    <>
      <span className="flex-1">{lesson.title}</span>
      <LessonDuration minutes={lesson.durationMinutes} />
    </>
  );

  if (isInstructor) {
    return (
      <Link
        to={`/instructor/${course.id}/lessons/${lesson.id}`}
        className={ROW_LINK_CLASS}
      >
        <Pencil className="size-4 shrink-0 text-muted-foreground" />
        {details}
      </Link>
    );
  }

  if (!canView) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 text-sm">
        <Circle className="size-4 shrink-0 text-muted-foreground" />
        {details}
      </div>
    );
  }

  return (
    <Link
      to={`/courses/${course.slug}/lessons/${lesson.id}`}
      className={ROW_LINK_CLASS}
    >
      <LessonStatusIcon status={lessonProgressMap[lesson.id]} />
      {details}
    </Link>
  );
}

function LessonStatusIcon({ status }: { status: string | undefined }) {
  if (status === LessonProgressStatus.Completed) {
    return <CheckCircle2 className="size-4 shrink-0 text-green-500" />;
  }
  if (status === LessonProgressStatus.InProgress) {
    return <PlayCircle className="size-4 shrink-0 text-blue-500" />;
  }
  return <Circle className="size-4 shrink-0 text-muted-foreground" />;
}

function LessonDuration({ minutes }: { minutes: number | null }) {
  if (!minutes) return null;
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <Clock className="size-3" />
      {formatDuration(minutes, true, false, false)}
    </span>
  );
}
