import Link from "next/link";

export default function NotFound(): JSX.Element {
  return (
    <div className="soft-card p-8">
      <h1 className="text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-sm text-muted">The requested peptide page could not be found.</p>
      <Link
        href="/peptides"
        className="mt-5 inline-flex rounded-xl border border-hairline bg-panel-muted px-3 py-2 text-sm hover:border-accent-blue"
      >
        Back to all peptides
      </Link>
    </div>
  );
}
