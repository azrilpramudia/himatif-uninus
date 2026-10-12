"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";

const navigation = [
  {
    label: "Beranda",
    href: "/admin/dashboard",
    icon: (
      <>
        <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1V10Z" />
      </>
    ),
  },
  {
    label: "Kegiatan",
    href: "/admin/dashboard/events",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18M8 14h3M8 17h6" />
      </>
    ),
  },
  {
    label: "Galeri",
    href: "/admin/dashboard/gallery",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </>
    ),
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (pathname === "/admin/login") {
    return children;
  }

  function handleLogout() {
    localStorage.removeItem("admin_token");
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-page)" }}>
      <aside className="flex w-full flex-col bg-primary text-white lg:fixed lg:inset-y-0 lg:min-h-screen lg:w-64">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 border-b border-white/10 px-6 py-5"
        >
          <Image
            src="/images/himatif-logo.png"
            alt="Logo HIMATIF UNINUS"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-wide">
              HIMATIF
            </span>
            <span className="text-xs text-white/70">Panel Pengelola</span>
          </span>
        </Link>

        <nav aria-label="Navigasi admin" className="flex-1 px-4 py-5">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
            Menu
          </p>
          <ul className="flex gap-2 overflow-x-auto lg:flex-col">
            {navigation.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      active
                        ? "bg-white text-primary shadow-sm"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <svg
                      aria-hidden="true"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {item.icon}
                    </svg>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden px-4 pb-5 lg:block">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 17l5-5-5-5M15 12H3" />
              <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
            </svg>
            Keluar
          </button>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 border-t border-white/10 px-5 py-3 text-sm text-white/75 transition hover:text-white lg:hidden"
        >
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 17l5-5-5-5M15 12H3" />
            <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
          </svg>
          Keluar
        </button>
      </aside>

      <div className="min-w-0 lg:pl-64">
        <header className="flex h-16 items-center justify-between bg-primary px-5 text-white shadow-sm sm:px-8">
          <div>
            <p className="text-sm font-semibold">
              {navigation.find((item) => item.href === pathname)?.label ??
                (pathname.startsWith("/admin/dashboard/events")
                  ? "Kegiatan"
                  : pathname.startsWith("/admin/dashboard/gallery")
                    ? "Galeri"
                    : "Beranda")}
            </p>
            <p className="mt-0.5 text-[11px] text-white/65">
              HIMATIF Universitas Islam Nusantara
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              disabled={!mounted}
              aria-label={
                resolvedTheme === "dark"
                  ? "Aktifkan mode terang"
                  : "Aktifkan mode gelap"
              }
              title={
                resolvedTheme === "dark"
                  ? "Aktifkan mode terang"
                  : "Aktifkan mode gelap"
              }
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-default"
            >
              {resolvedTheme === "dark" ? (
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
                </svg>
              )}
            </button>
            <Link
              href="/"
              target="_blank"
              className="rounded-lg px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Lihat website
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
