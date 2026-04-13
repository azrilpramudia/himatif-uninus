export type NavItem = {
  label: string;
  href: string;
  isExternal?: boolean;
};

export type NavGroup = {
  label: string;
  href: string;
  children?: NavItem[];
};

// ===== Public Navigation =====
export const publicNavItems: NavGroup[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Events",
    href: "/events",
  },
  {
    label: "Gallery",
    href: "/gallery",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

// ===== Admin Sidebar Navigation =====
export type AdminNavItem = {
  label: string;
  href: string;
  icon: string; // nama icon — dipakai di komponen Sidebar
};

export type AdminNavGroup = {
  group: string;
  items: AdminNavItem[];
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    group: "Utama",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: "LayoutDashboard",
      },
    ],
  },
  {
    group: "Konten",
    items: [
      {
        label: "Kegiatan",
        href: "/dashboard/events",
        icon: "CalendarDays",
      },
      {
        label: "Galeri",
        href: "/dashboard/gallery",
        icon: "Images",
      },
    ],
  },
  {
    group: "Pengaturan",
    items: [
      {
        label: "Profil",
        href: "/dashboard/profile",
        icon: "UserCircle",
      },
    ],
  },
];

// ===== Footer Navigation =====
export type FooterNavGroup = {
  group: string;
  items: NavItem[];
};

export const footerNavGroups: FooterNavGroup[] = [
  {
    group: "Halaman",
    items: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Events", href: "/events" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    group: "Organisasi",
    items: [
      { label: "Sejarah", href: "/about#history" },
      { label: "Struktur Organisasi", href: "/about#structure" },
      { label: "Program Kerja", href: "/about#proker" },
    ],
  },
  {
    group: "Media",
    items: [
      {
        label: "Instagram",
        href: "https://instagram.com/himatif_uninus",
        isExternal: true,
      },
      {
        label: "YouTube",
        href: "https://youtube.com/@himatif_uninus",
        isExternal: true,
      },
      {
        label: "GitHub",
        href: "https://github.com/himatif-uninus",
        isExternal: true,
      },
    ],
  },
];
