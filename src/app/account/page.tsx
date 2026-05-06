import { AppShell } from "@/components/app/AppShell";

export const metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <AppShell pageTitle="Account">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Profile">
          <Field label="Full name" defaultValue="Jane Smith" />
          <Field label="Email" defaultValue="jane@smithproperty.com.au" />
          <Field label="Company" defaultValue="Smith Property" />
          <button className="btn-tick text-sm">Save profile</button>
        </Card>

        <Card title="Branding">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-ink/50">
              Logo
            </label>
            <div className="mt-1 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-ink text-sm font-semibold text-white">
                SP
              </div>
              <button className="btn-secondary text-sm">Upload logo</button>
            </div>
          </div>
          <Field label="Brand colour" defaultValue="#10B981" />
          <Field
            label="Default reply-to"
            defaultValue="jane@smithproperty.com.au"
          />
          <button className="btn-tick text-sm">Save branding</button>
        </Card>

        <Card title="Email defaults">
          <Field
            label="Default subject"
            defaultValue="Please complete: {FormName}"
          />
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-ink/50">
              Default message
            </label>
            <textarea
              rows={4}
              defaultValue="Hi — please complete this form. It only takes a few minutes on your phone."
              className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm focus:border-tick focus:outline-none"
            />
          </div>
          <button className="btn-tick text-sm">Save defaults</button>
        </Card>

        <Card title="Filename pattern">
          <Field
            label="Pattern"
            defaultValue="{FormName}_{SignerFirstName}-{SignerLastName}_{YYYY-MM-DD}.pdf"
          />
          <p className="rounded-lg bg-paper p-3 font-mono text-xs text-ink/65">
            Preview: Tenancy-Application_Jane-Smith_2026-05-06.pdf
          </p>
          <button className="btn-tick text-sm">Save pattern</button>
        </Card>
      </div>
    </AppShell>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      <h2 className="font-semibold text-ink">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-ink/50">
        {label}
      </label>
      <input
        {...props}
        className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm focus:border-tick focus:outline-none"
      />
    </div>
  );
}
