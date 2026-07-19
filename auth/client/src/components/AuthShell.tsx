import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const appName = import.meta.env.VITE_APP_NAME ?? "App";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Link to="/" className="mb-6 inline-flex text-sm font-semibold text-slate-900">
          {appName}
        </Link>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>
        {children}
      </section>
    </main>
  );
}
