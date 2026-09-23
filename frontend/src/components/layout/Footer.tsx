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
    <motion.div variants={fadeUpItem} className="flex items-center gap-3">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0">
        <Image
          src={siteConfig.logo}
          alt={siteConfig.logoAlt}
          width={56}
          height={56}
          className="object-contain"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-white font-bold text-lg md:text-xl leading-tight tracking-wide">
          HIMATIF
        </span>
        <span className="text-white font-semibold text-lg md:text-xl leading-tight tracking-wide">
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
    <motion.div variants={fadeUpItem} className="flex flex-col gap-3">
      <h3 className="text-white font-semibold text-xs tracking-widest uppercase">
        {title}
      </h3>
      <div className="w-full h-px bg-white/20" />
      <ul className="flex flex-col gap-2.5">
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

// ===== Footer Bottom =====
function FooterBottom() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.div
      variants={fadeUpItem}
      className="border-t border-white/15 pt-5 mt-8 flex flex-col items-center gap-1 sm:flex-row sm:justify-between"
    >
      <p className="text-white/35 text-xs text-center sm:text-left">
        © {currentYear} {siteConfig.fullName}. All rights reserved.
      </p>
    </motion.div>
  );
}

// ===== Main Footer =====
export default function Footer() {
  return (
    <footer className="bg-primary">
      <div className="max-w-7xl mx-auto px-8 lg:px-8 pt-10 md:pt-14 pb-8">
        <motion.div
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col gap-10 md:grid md:grid-cols-3 md:gap-8"
        >
          {/* ===== Left — Logo & Tagline ===== */}
          <div className="flex flex-col gap-3 md:col-span-1">
            <FooterLogo />
            <motion.p
              variants={fadeUpItem}
              className="text-white/55 text-sm leading-relaxed"
            >
              Developed by UNINUS HIMATIF Team
            </motion.p>
          </div>

          {/* ===== Right - Navigation Footer ===== */}
          <div className="grid grid-cols-2 gap-6 md:col-span-2 md:flex md:flex-row md:justify-end">
            {footerColumns.map((column) => (
              <div key={column.title} className="md:min-w-36">
                <FooterNavColumn title={column.title} links={column.links} />
              </div>
            ))}
          </div>
        </motion.div>

        <FooterBottom />
      </div>
    </footer>
  );
}
