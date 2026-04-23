import { siteConfig } from "./siteConfig";

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

export type FooterColumn = {
  title: string;
  links: NavItem[];
};

// ===== Public Navigation =====
export const publicNavItems: NavGroup[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

// ===== Footer Columns =====
export const footerColumns: FooterColumn[] = [
  {
    title: "Sitemap",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Events", href: "/events" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Contact Us",
    links: [
      {
        label: "Instagram",
        href: siteConfig.socialMedia.instagram,
        isExternal: true,
      },
      { label: "Email", href: `mailto:${siteConfig.email}`, isExternal: true },
      { label: "WhatsApp", href: siteConfig.whatsapp, isExternal: true },
      {
        label: "YouTube",
        href: siteConfig.socialMedia.youtube,
        isExternal: true,
      },
    ],
  },
];

// ===== Admin Sidebar Navigation =====
export type AdminNavItem = {
  label: string;
  href: string;
  icon: string;
};

export type AdminNavGroup = {
  group: string;
  items: AdminNavItem[];
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    group: "Utama",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    ],
  },
  {
    group: "Konten",
    items: [
      { label: "Kegiatan", href: "/dashboard/events", icon: "CalendarDays" },
      { label: "Galeri", href: "/dashboard/gallery", icon: "Images" },
    ],
  },
  {
    group: "Pengaturan",
    items: [
      { label: "Profil", href: "/dashboard/profile", icon: "UserCircle" },
    ],
  },
];
