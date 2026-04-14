/* eslint-disable react-hooks/set-state-in-effect */
// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { publicNavItems } from "@/constants/navigation";
import { siteConfig } from "@/constants/siteConfig";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Detect scroll untuk shadow effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup mobile menu saat navigasi
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-primary/95 backdrop-blur-md shadow-lg shadow-black/10"
          : "bg-primary",
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ===== Logo ===== */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            {/* Jika sudah ada file logo, ganti dengan Image */}
            {/* <Image
              src={siteConfig.logo}
              alt={siteConfig.logoAlt}
              width={36}
              height={36}
              className="object-contain"
            /> */}

            {/* Logo placeholder — ganti saat logo sudah ada */}
            <div className="w-9 h-9 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center shrink-0 transition-all duration-200 group-hover:bg-white/20">
              <span className="text-white font-bold text-sm tracking-tight">
                H
              </span>
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-white font-semibold text-base tracking-wide">
                HIMATIF
              </span>
              <span className="text-white/60 font-normal text-[10px] tracking-widest uppercase">
                Uninus
              </span>
            </div>
          </Link>

          {/* ===== Desktop Nav ===== */}
          <div className="hidden md:flex items-center gap-1">
            {publicNavItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10",
                  )}
                >
                  {item.label}

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-white/15 rounded-lg"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ===== Right Side: Toggle + Mobile Burger ===== */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Mobile Burger */}
            <button
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <motion.span
                animate={
                  isMobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.2 }}
                className="block w-5 h-0.5 bg-white rounded-full origin-center"
              />
              <motion.span
                animate={
                  isMobileOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }
                }
                transition={{ duration: 0.2 }}
                className="block w-5 h-0.5 bg-white rounded-full"
              />
              <motion.span
                animate={
                  isMobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.2 }}
                className="block w-5 h-0.5 bg-white rounded-full origin-center"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ===== Mobile Menu ===== */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-white/10"
          >
            <div className="bg-primary/98 backdrop-blur-md px-6 py-4 flex flex-col gap-1">
              {publicNavItems.map((item, index) => {
                const isActive = pathname === item.href;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-white/15 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/10",
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
