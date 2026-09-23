"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqData, type FaqItem } from "@/constants/faq";
import { fadeUpContainer, fadeUpItem } from "@/lib/animations";

// ===== Accordion Item =====
function FaqCard({
  item,
  isOpen,
  onClick,
}: {
  item: FaqItem;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      variants={fadeUpItem}
      className="flex flex-col border border-primary/15 rounded-2xl overflow-hidden bg-var(--bg-card) transition-colors duration-300"
    >
      <button
        onClick={onClick}
        className="flex items-center justify-between w-full px-6 py-5 text-left focus:outline-none focus-visible:bg-primary/5"
      >
        <span className="font-semibold text-base md:text-lg text-var(--text-body) pr-4">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pt-1 text-sm md:text-base leading-relaxed text-var(--text-muted)">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ===== Main Section =====
export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(faqData[0].id); // First item open by default

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-20 bg-var(--bg-page)">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-10"
        >
          {/* Section Header */}
          <div className="flex flex-col gap-3 text-center items-center">
            <motion.h2
              variants={fadeUpItem}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary"
            >
              Tanya Jawab (FAQ)
            </motion.h2>
            <motion.div
              variants={fadeUpItem}
              className="w-12 h-1 rounded-full bg-primary"
            />
            <motion.p
              variants={fadeUpItem}
              className="text-sm sm:text-base text-var(--text-muted) max-w-xl mt-2"
            >
              Beberapa pertanyaan yang sering diajukan terkait Himatif Uninus.
            </motion.p>
          </div>

          {/* Accordion List */}
          <div className="flex flex-col gap-4">
            {faqData.map((item) => (
              <FaqCard
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onClick={() => toggleItem(item.id)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
