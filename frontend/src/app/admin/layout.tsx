"use client";

import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return children;
  }

  return (
    <div>
      <h1>Admin Layout</h1>
      <nav>
        <ul>
          <li>
            <a href="/admin/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/admin/dashboard/gallery">Gallery</a>
          </li>
          <li>
            <a href="/admin/dashboard/events">Events</a>
          </li>
        </ul>
      </nav>
      <main>{children}</main>
    </div>
  );
}
