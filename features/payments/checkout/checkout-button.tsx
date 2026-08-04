"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => { open(): void };
  }
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
}

const CHECKOUT_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
// hsl(30 42% 52%) — this project's --accent token — computed exactly
// rather than eyeballed, since Razorpay's theme option wants a hex string.
const ACCENT_HEX = "#B88551";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = CHECKOUT_SCRIPT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutButton({
  planId,
  planName,
  memberName,
  memberEmail,
}: {
  planId: string;
  planName: string;
  memberName: string;
  memberEmail: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/razorpay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        setError("Couldn't load the payment window. Please try again.");
        setIsLoading(false);
        return;
      }

      const checkout = new window.Razorpay({
        key: data.keyId,
        amount: data.amountPaise,
        currency: data.currency,
        order_id: data.orderId,
        name: "Aurevon Studios",
        description: data.planName,
        prefill: { name: memberName, email: memberEmail },
        theme: { color: ACCENT_HEX },
        handler: () => {
          // Razorpay's checkout handler fires once the payment succeeds,
          // but the signature-verified webhook — not this client
          // redirect — is what actually activates the membership (it
          // usually lands within seconds). This just sends the member
          // somewhere that reflects the new state once it does.
          router.push(`${window.location.pathname}?justPaid=1`);
        },
        modal: {
          ondismiss: () => setIsLoading(false),
        },
      });
      checkout.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleCheckout} disabled={isLoading} className="w-full">
        {isLoading ? "Starting checkout…" : `Pay for ${planName}`}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
