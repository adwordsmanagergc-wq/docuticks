import { Plus, MoreHorizontal } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";

export const metadata = { title: "Team" };

const MEMBERS = [
  { name: "Jane Smith", email: "jane@smithproperty.com.au", role: "Owner" },
  { name: "Tom Burke", email: "tom@smithproperty.com.au", role: "Editor" },
  { name: "Olivia Tran", email: "olivia@smithproperty.com.au", role: "Viewer" },
];

export default function TeamPage() {
  return (
    <AppShell
      pageTitle="Team"
      pageActions={
        <button className="btn-tick text-sm">
          <Plus className="h-4 w-4" /> Invite teammate
        </button>
      }
    >
      <div className="card overflow-hidden">
        <div className="border-b border-ink/10 px-6 py-4">
          <h2 className="font-semibold text-ink">Members</h2>
          <p className="mt-1 text-xs text-ink/55">
            3 of 3 seats used · Intermediate plan
          </p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-paper text-left text-xs uppercase tracking-wider text-ink/50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {MEMBERS.map((m) => (
              <tr key={m.email}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-medium text-white">
                      {m.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </span>
                    <span className="font-medium text-ink">{m.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-ink/65">{m.email}</td>
                <td className="px-6 py-4">
                  <span className="chip">{m.role}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-ink/40 hover:text-ink">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
