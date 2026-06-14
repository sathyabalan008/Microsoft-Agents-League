import Link from "next/link";

const actions = [
  {
    title: "Election Setup",
    description:
      "Create elections, choose election type, configure ballot templates, and manage candidates.",
    href: "/admin/elections",
  },
  {
    title: "Booth QR",
    description:
      "Generate QR code and public ballot links for voters to access the ballot page directly.",
    href: "/admin/booth",
  },
  {
    title: "Election Results",
    description:
      "View vote counts, percentages, charts, tables, and election analytics.",
    href: "/admin/results",
  },
  {
    title: "User Management",
    description:
      "Manage election managers, assign access, and control who can create and run elections.",
    href: "/admin/users",
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#000b2e] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm text-cyan-300">Election Command Center</p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Admin Control Panel
          </h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Select a module to manage election setup, voter access, QR-based
            ballot entry, results, and election manager permissions.
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          {actions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400 hover:bg-white/10"
            >
              <h2 className="text-2xl font-semibold">{action.title}</h2>
              <p className="mt-3 text-slate-300">{action.description}</p>

              <div className="mt-6 inline-flex rounded-full bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950">
                Open Module
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}