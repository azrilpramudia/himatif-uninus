import { HomeIcon, CalendarIcon, GalleryIcon } from "@/components/icons";
import type { NavItem } from "@/types/navigation";

export const adminNavigation: NavItem[] = [
  {
    label: "Beranda",
    href: "/admin/dashboard",
    icon: <HomeIcon />,
  },
  {
    label: "Kegiatan",
    href: "/admin/dashboard/events",
    icon: <CalendarIcon />,
  },
  {
    label: "Galeri",
    href: "/admin/dashboard/gallery",
    icon: <GalleryIcon />,
  },
];