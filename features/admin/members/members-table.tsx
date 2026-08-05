import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { ROUTES } from "@/lib/constants/routes";
import type { MemberProfile } from "@/lib/supabase/queries/members";

export function MembersTable({
  members,
  search,
  currentPage,
  totalPages,
}: {
  members: MemberProfile[];
  search?: string;
  currentPage: number;
  totalPages: number;
}) {
  return (
    <div className="flex flex-col gap-6">
      <form action={ROUTES.adminMembers} className="flex max-w-md gap-3">
        <Input
          name="search"
          placeholder="Search by name or email"
          defaultValue={search ?? ""}
          aria-label="Search members"
        />
        <Button type="submit" variant="outline" className="shrink-0">
          Search
        </Button>
      </form>

      {members.length === 0 ? (
        <div className="border border-border bg-surface p-8 md:p-10">
          <p className="text-sm text-muted">
            {search ? `No members match "${search}".` : "No members yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-border bg-surface">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-widest2 text-muted">
                <th scope="col" className="px-6 py-4 font-medium">
                  Name
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Email
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-6 py-4 text-foreground">
                    {member.full_name || "—"}
                  </td>
                  <td className="px-6 py-4 text-muted">{member.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        member.status === "active"
                          ? "text-success"
                          : "text-muted"
                      }
                    >
                      {member.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`${ROUTES.adminMembers}/${member.id}`}
                      className="text-accent underline underline-offset-4 hover:text-accent-bright"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        basePath={ROUTES.adminMembers}
        currentPage={currentPage}
        totalPages={totalPages}
        searchParams={{ search }}
      />
    </div>
  );
}
