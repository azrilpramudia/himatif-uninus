"use client";

import { motion } from "framer-motion";
import { workPrograms } from "@/constants/workPrograms";
import { fadeUpContainer, fadeUpItem } from "@/lib/animations";
import type { WorkProgram } from "@/types/workProgram";

// ===== Card =====
function WorkProgramCard({ item }: { item: WorkProgram }) {
  return (
    <motion.div
      variants={fadeUpItem}
      className="group flex flex-col gap-3 p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default"
      style={{
        borderColor: "rgba(18, 64, 118, 0.15)",
        backgroundColor: "var(--bg-card)",
      }}
    >
      <h3 className="font-semibold text-base leading-snug text-primary">
        {item.title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--text-body)" }}
      >
        {item.description}
      </p>
    </motion.div>
  );
}

// ===== Section Header =====
function SectionHeader() {
  return (
    <motion.div
      variants={fadeUpContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="flex flex-col gap-3 mb-10"
    >
      <motion.h2
        variants={fadeUpItem}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary"
      >
        Program Kerja
      </motion.h2>

      <motion.div
        variants={fadeUpItem}
        className="w-12 h-1 rounded-full bg-primary"
      />

      <motion.p
        variants={fadeUpItem}
        className="text-sm sm:text-base"
        style={{ color: "var(--text-body)" }}
      >
        Berikut Program Kerja Periode Kepengurusan 2024 - 2025
      </motion.p>
    </motion.div>
  );
}

// ===== Main Section =====
export default function WorkProgramSection() {
  return (
    <section
      className="py-20"
      style={{ backgroundColor: "var(--bg-section-alt)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader />

        <motion.div
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {workPrograms.map((item) => (
            <WorkProgramCard key={item.id} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
