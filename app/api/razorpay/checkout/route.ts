import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { checkoutRequestSchema } from "@/lib/validations/payments";
import { createCheckoutOrder } from "@/features/payments/checkout/create-checkout-order";

// Not covered by middleware.ts (its matcher only lists page paths), so
// this route does its own auth check — deliberately not `requireRole()`,
// which redirects on failure. A redirect response would break a
// fetch()-based client expecting JSON; a 401/403 body is the right shape
// for an API route.
export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
  }
  if (profile.role !== "member") {
    return NextResponse.json(
      { error: "Only members can start checkout." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 }
    );
  }

  const result = await createCheckoutOrder({
    memberId: profile.id,
    planId: parsed.data.planId,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
