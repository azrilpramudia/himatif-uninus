import type { ReactNode } from "react";

export type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

export type NavGroup = {
  group: string;
  items: NavItem[];
};
