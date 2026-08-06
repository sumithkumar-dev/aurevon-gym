"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const POLL_INTERVAL_MS = 3000;
// ~30s total — the webhook is normally near-instant; this is generous
// headroom for Razorpay/network delivery lag, not a real processing wait.
const MAX_ATTEMPTS = 10;

/**
 * Shown after a Razorpay checkout redirect (`?justPaid=1`) while we wait
 * for the signature-verified webhook — not this page load — to actually
 * activate the membership. Polls by calling `router.refresh()`, which
 * re-runs this Server Component page and passes this component fresh
 * `isActive` props; it does not remount, so the attempt counter survives
 * each refresh.
 *
 * Previously this was a static "refresh this page shortly" message with
 * no actual refreshing — real, but weak, feedback for what should feel
 * instant.
 */
export function PendingActivationBanner({ isActive }: { isActive: boolean }) {
  const router = useRouter();
  const attemptsRef = useRef(0);
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    if (isActive || gaveUp) {
      return;
    }
    const timeoutId = setTimeout(() => {
      attemptsRef.current += 1;
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        setGaveUp(true);
        return;
      }
      router.refresh();
    }, POLL_INTERVAL_MS);
    return () => clearTimeout(timeoutId);
  }, [isActive, gaveUp, router]);

  if (isActive) {
    return (
      <div className="mt-8 border border-success/40 bg-surface p-6">
        <p role="status" className="text-sm text-foreground">
          Membership activated – you&apos;re all set.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 border border-accent-dim bg-surface p-6">
      <p role="status" aria-live="polite" className="text-sm text-foreground">
        {gaveUp
          ? "Still confirming your payment – this can occasionally take a few minutes. Your membership will activate automatically once it's confirmed; refresh this page any time to check."
          : "Payment received – activating your membership…"}
      </p>
    </div>
  );
}
