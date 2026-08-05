"use client";

import { useActionState } from "react";
import { updateMemberStatusAction, type MemberStatusState } from "./actions";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const initialState: MemberStatusState = null;

export function MemberStatusForm({
  memberId,
  status,
}: {
  memberId: string;
  status: "active" | "inactive";
}) {
  const action = updateMemberStatusAction.bind(null, memberId);
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="status">Account Status</Label>
        <Select
          id="status"
          name="status"
          defaultValue={status}
          className="w-40"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>
      <Button type="submit" variant="outline" disabled={isPending}>
        {isPending ? "Saving…" : "Update Status"}
      </Button>
      {state?.error && (
        <p role="alert" className="w-full text-sm text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}
