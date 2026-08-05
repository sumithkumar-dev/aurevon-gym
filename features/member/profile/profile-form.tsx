"use client";

import { useActionState } from "react";
import { updateProfileAction, type UpdateProfileState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/lib/supabase/queries/profiles";

const initialState: UpdateProfileState = null;

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  );

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={profile.email} disabled readOnly />
        <p className="text-xs text-muted">
          Contact the front desk to change the email on your account.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={profile.full_name}
            required
            autoComplete="name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={profile.phone ?? ""}
            autoComplete="tel"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            defaultValue={profile.date_of_birth ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="gender">Gender</Label>
          <Input id="gender" name="gender" defaultValue={profile.gender ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          defaultValue={profile.address ?? ""}
          autoComplete="street-address"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="emergency_contact_name">
            Emergency Contact Name
          </Label>
          <Input
            id="emergency_contact_name"
            name="emergency_contact_name"
            defaultValue={profile.emergency_contact_name ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="emergency_contact_phone">
            Emergency Contact Phone
          </Label>
          <Input
            id="emergency_contact_phone"
            name="emergency_contact_phone"
            defaultValue={profile.emergency_contact_phone ?? ""}
          />
        </div>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p role="status" className="text-sm text-success">
          Profile updated.
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
}
