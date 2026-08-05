import type {
  MembershipStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/lib/supabase/database.types";

export const MEMBERSHIP_STATUS_LABELS: Record<MembershipStatus, string> = {
  pending: "Pending Payment",
  active: "Active",
  frozen: "Frozen",
  cancelled: "Cancelled",
  expired: "Expired",
};

// Tailwind text-color utility per status, used for the small status
// indicator on the member dashboard and the admin dashboard.
export const MEMBERSHIP_STATUS_TONE: Record<MembershipStatus, string> = {
  pending: "text-warning",
  active: "text-success",
  frozen: "text-info",
  cancelled: "text-muted",
  expired: "text-muted",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  created: "Created",
  authorized: "Authorized",
  captured: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

export const PAYMENT_STATUS_TONE: Record<PaymentStatus, string> = {
  created: "text-muted",
  authorized: "text-warning",
  captured: "text-success",
  failed: "text-destructive",
  refunded: "text-info",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  online: "Online",
  offline: "Front Desk",
};

/** `price_paise` / `amount_paise` (the Razorpay-native integer unit) as a
 * localized INR display string, e.g. `599900` -> `"₹5,999"`. */
export function formatCurrency(amountPaise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountPaise / 100);
}

/** A `date`/`timestamptz` column value as a localized display string, or
 * an em dash for `null` (e.g. a membership that hasn't started yet). */
export function formatDate(value: string | null): string {
  if (!value) {
    return "—";
  }
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
    new Date(value)
  );
}
