"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { footerColumns } from "@/constants/navigation";
import { siteConfig } from "@/constants/siteConfig";
import { fadeUpContainer, fadeUpItem } from "@/lib/animations";
import { cn } from "@/lib/utils";

// ===== Footer Logo =====
function FooterLogo() {
  return (
    <motion.div variants={fadeUpItem} className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ">
        <Image
          src={siteConfig.logo}
          alt={siteConfig.logoAlt}
          width={56}
          height={56}
          className="object-contain"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-white font-bold text-xl leading-tight tracking-wide">
          HIMATIF
        </span>
        <span className="text-white font-semibold text-xl leading-tight tracking-wide">
          UNINUS
        </span>
      </div>
    </motion.div>
  );
}

// ===== Footer Nav Column =====
type FooterNavColumnProps = {
  title: string;
  links: { label: string; href: string; isExternal?: boolean }[];
};

function FooterNavColumn({ title, links }: FooterNavColumnProps) {
  return (
    <motion.div variants={fadeUpItem} className="flex flex-col gap-4">
      <h3 className="text-white font-semibold text-sm tracking-widest uppercase">
        {title}
      </h3>
      <div className="w-full h-px bg-white/20" />
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              target={link.isExternal ? "_blank" : undefined}
              rel={link.isExternal ? "noopener noreferrer" : undefined}
              className={cn(
                "text-white/60 text-sm transition-all duration-200",
                "hover:text-white hover:translate-x-1 inline-block",
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ===== Footer Bottom Bar =====
function FooterBottom() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.div
      variants={fadeUpItem}
      className="border-t border-white/15 pt-5 mt-8 flex flex-col sm:flex-row items-center justify-between gap-2"
    >
      <p className="text-white/35 text-xs">
        © {currentYear} {siteConfig.fullName}. All rights reserved.
      </p>
      <p className="text-white/35 text-xs">{siteConfig.university}</p>
    </motion.div>
  );
}

// ===== Main Footer =====
export default function Footer() {
  return (
    <footer className="bg-primary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-8">
        <motion.div
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"
        >
          {/* Kiri — Logo & Tagline */}
          <div className="md:col-span-1 flex flex-col gap-5">
            <FooterLogo />
            <motion.p
              variants={fadeUpItem}
              className="text-white/55 text-sm leading-relaxed"
            >
              Developed by UNINUS HIMATIF Team
            </motion.p>
          </div>

          {/* Kanan — Kolom Navigasi */}
          <div className="md:col-span-2 grid grid-cols-2 gap-8 md:gap-12 lg:justify-items-end">
            {footerColumns.map((column) => (
              <FooterNavColumn
                key={column.title}
                title={column.title}
                links={column.links}
              />
            ))}
          </div>
        </motion.div>

        <FooterBottom />
      </div>
    </footer>
  );
}
