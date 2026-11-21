import { Link } from "react-router";
import { PlayCircle, ShieldAlert, Users } from "lucide-react";
import { Button } from "~/components/ui/button";
import { countryName } from "~/lib/ppp";
import { RateCourse } from "./rate-course";
import { RequestRefund } from "./request-refund";

type CountryLock = { purchaseCountry: string; currentCountry: string };

type CourseProgressProps = {
  course: {
    id: number;
    slug: string;
    modules: Array<{ lessons: Array<{ id: number }> }>;
  };
  progress: number;
  nextLessonId: number | null;
};

export type EnrolledPanelProps = CourseProgressProps & {
  canTake: boolean;
  countryLock: CountryLock | null;
  teamPurchaseLink: string;
  userRating: number | null;
  refundOffer: { purchaseId: number; amount: number } | null;
};

export function EnrolledPanel({
  canTake,
  countryLock,
  teamPurchaseLink,
  userRating,
  refundOffer,
  ...progress
}: EnrolledPanelProps) {
  return (
    <>
      {countryLock && <CountryLockNotice countryLock={countryLock} />}
      {canTake && <CourseProgress {...progress} />}
      <Link to={teamPurchaseLink}>
        <Button variant="outline" className="w-full">
          <Users className="mr-2 size-4" />
          Buy More Seats
        </Button>
      </Link>
      {canTake && <RateCourse userRating={userRating} />}
      {refundOffer && (
        <RequestRefund
          slug={progress.course.slug}
          purchaseId={refundOffer.purchaseId}
          amount={refundOffer.amount}
        />
      )}
    </>
  );
}

function CountryLockNotice({ countryLock }: { countryLock: CountryLock }) {
  return (
    <div className="flex gap-2 rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-sm">
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-500" />
      <p>
        You bought this course at a Purchasing-Power Price in{" "}
        <strong>{countryName(countryLock.purchaseCountry)}</strong>, so it
        can&apos;t be used from{" "}
        <strong>{countryName(countryLock.currentCountry)}</strong>.
      </p>
    </div>
  );
}

function CourseProgress({
  course,
  progress,
  nextLessonId,
}: CourseProgressProps) {
  const targetLessonId = nextLessonId ?? course.modules[0]?.lessons[0]?.id;
  return (
    <>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span>{progress}% complete</span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      {targetLessonId ? (
        <Link to={`/courses/${course.slug}/lessons/${targetLessonId}`}>
          <Button className="w-full">
            <PlayCircle className="mr-2 size-4" />
            {progress > 0 ? "Continue Learning" : "Start Course"}
          </Button>
        </Link>
      ) : null}
    </>
  );
}
