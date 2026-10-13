"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { SunIcon, MoonIcon, LogoutIcon } from "@/components/icons";
import { adminNavigation } from "@/constants/adminNavigation";
import { useLogout } from "@/hooks/useAuth";

function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/admin/dashboard/events")) return "Kegiatan";
  if (pathname.startsWith("/admin/dashboard/gallery")) return "Galeri";
  return "Beranda";
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { logout, logoutError } = useLogout();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-page)" }}>
      {/* ===== Sidebar ===== */}
      <aside className="flex w-full flex-col bg-primary text-white lg:fixed lg:inset-y-0 lg:min-h-screen lg:w-64">
        {/* Logo */}
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

        {/* Nav */}
        <nav aria-label="Navigasi admin" className="flex-1 px-4 py-5">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
            Menu
          </p>
          <ul className="flex gap-2 overflow-x-auto lg:flex-col">
            {adminNavigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      isActive
                        ? "bg-white text-primary shadow-sm"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 px-4 py-4">
          {logoutError && (
            <p role="alert" className="mb-2 px-3 text-xs text-red-200">
              {logoutError}
            </p>
          )}
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <LogoutIcon />
            Keluar
          </button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <div className="min-w-0 lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-primary px-5 text-white shadow-sm sm:px-8">
          <div>
            <p className="text-sm font-semibold">{getPageTitle(pathname)}</p>
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
                !mounted
                  ? "Memuat preferensi tema"
                  : resolvedTheme === "dark"
                  ? "Aktifkan mode terang"
                  : "Aktifkan mode gelap"
              }
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white/10 disabled:cursor-default"
            >
              {mounted ? (
                resolvedTheme === "dark" ? (
                  <SunIcon />
                ) : (
                  <MoonIcon />
                )
              ) : (
                <span aria-hidden="true" className="h-5 w-5" />
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

        {/* Content */}
        <main className="mx-auto w-full max-w-7xl p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
