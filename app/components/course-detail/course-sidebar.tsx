import type { ReactNode } from "react";
import { Link } from "react-router";
import { BookOpen, Clock, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { UserAvatar } from "~/components/user-avatar";
import { formatDuration, formatLessonCount } from "~/lib/utils";
import { EnrolledPanel, type EnrolledPanelProps } from "./enrolled-panel";

type CourseSidebarProps = Omit<EnrolledPanelProps, "course"> & {
  course: EnrolledPanelProps["course"] & CourseFactsProps["course"];
  isInstructor: boolean;
  enrolled: boolean;
  lessonCount: number;
  totalDuration: number;
  enrollButton: ReactNode;
};

export function CourseSidebar({
  isInstructor,
  enrolled,
  lessonCount,
  totalDuration,
  enrollButton,
  ...panel
}: CourseSidebarProps) {
  const { course } = panel;
  return (
    <div className="space-y-6">
      <Card className="sticky top-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {isInstructor
              ? "Your Course"
              : enrolled
                ? "Your Progress"
                : "Get Started"}
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {isInstructor ? (
            <Link to={`/instructor/${course.id}`}>
              <Button className="w-full">
                <Pencil className="mr-2 size-4" />
                Manage Course
              </Button>
            </Link>
          ) : enrolled ? (
            <EnrolledPanel {...panel} />
          ) : (
            enrollButton
          )}
          <CourseFacts
            course={course}
            lessonCount={lessonCount}
            totalDuration={totalDuration}
          />
        </CardContent>
      </Card>
    </div>
  );
}

type CourseFactsProps = {
  course: {
    instructorName: string;
    instructorAvatarUrl: string | null;
    instructorBio: string | null;
  };
  lessonCount: number;
  totalDuration: number;
};

function CourseFacts({ course, lessonCount, totalDuration }: CourseFactsProps) {
  return (
    <div className="space-y-2 pt-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <BookOpen className="size-4" />
        <span>{formatLessonCount(lessonCount)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="size-4" />
        <span>{formatDuration(totalDuration, true, false, false)} total</span>
      </div>
      <div className="flex items-center gap-2">
        <UserAvatar
          name={course.instructorName}
          avatarUrl={course.instructorAvatarUrl}
          className="size-5"
        />
        <span>Taught by {course.instructorName}</span>
      </div>
      {course.instructorBio && (
        <p className="mt-2 text-xs leading-relaxed">{course.instructorBio}</p>
      )}
    </div>
  );
}
