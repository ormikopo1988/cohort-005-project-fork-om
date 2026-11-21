import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { formatPrice } from "~/lib/utils";

type RefundFetcher = ReturnType<
  typeof useFetcher<{ errors?: Record<string, string> }>
>;

type RequestRefundProps = {
  slug: string;
  purchaseId: number;
  amount: number;
};

export function RequestRefund(props: RequestRefundProps) {
  const fetcher: RefundFetcher = useFetcher();
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const firstError = Object.values(fetcher.data?.errors ?? {})[0];
    if (fetcher.state === "idle" && firstError) {
      toast.error(firstError);
    }
  }, [fetcher.state, fetcher.data]);

  if (!isFormOpen) {
    return (
      <div className="border-t pt-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
          onClick={() => setIsFormOpen(true)}
        >
          Request a refund
        </Button>
      </div>
    );
  }

  return (
    <RefundForm
      {...props}
      fetcher={fetcher}
      onCancel={() => setIsFormOpen(false)}
    />
  );
}

function RefundForm({
  slug,
  purchaseId,
  amount,
  fetcher,
  onCancel,
}: RequestRefundProps & { fetcher: RefundFetcher; onCancel: () => void }) {
  const isSubmitting = fetcher.state !== "idle";
  return (
    <div className="border-t pt-4">
      <p className="mb-2 text-sm font-medium">Request a refund</p>
      <p className="mb-3 text-xs text-muted-foreground">
        We will send {formatPrice(amount)} back to the card you paid with, once
        someone has read your note.
      </p>
      <fetcher.Form
        method="post"
        action={`/courses/${slug}/refund`}
        className="space-y-2"
      >
        <input type="hidden" name="purchaseId" value={purchaseId} />
        <Textarea
          name="reason"
          rows={3}
          required
          placeholder="What went wrong?"
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Request a refund"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Keep it
          </Button>
        </div>
      </fetcher.Form>
    </div>
  );
}
