"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUpContainer, fadeUpItem } from "@/lib/animations";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* ===== Hero About ===== */}
      <section className="py-20 bg-var(--bg-page)">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            variants={fadeUpContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center gap-6"
          >
            <motion.h1
              variants={fadeUpItem}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary"
            >
              Tentang Kami
            </motion.h1>
            <motion.div
              variants={fadeUpItem}
              className="w-16 h-1.5 rounded-full bg-primary"
            />
            <motion.p
              variants={fadeUpItem}
              className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl text-var(--text-body)"
            >
              HIMATIF UNINUS berkedudukan di Jurusan Teknik Informatika Fakultas
              Teknik Universitas Islam Nusantara dan secara operasional
              bertempat di Sekretariatan Senat Mahasiswa Fakultas Teknik (SEMA
              F-TEK) UNINUS. Sekretariat tersebut menjadi pusat kegiatan
              organisasi yang mendukung pelaksanaan fungsi HIMATIF UNINUS
              sebagai wadah pengembangan akademik, keorganisasian, dan
              penyaluran aspirasi mahasiswa Teknik Informatika.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ===== Visi & Misi ===== */}
      <section className="py-24 bg-var(--bg-section-alt)">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Visi */}
            <motion.div
              variants={fadeUpContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="flex flex-col gap-5 p-8 rounded-3xl bg-var(--bg-card) border border-primary/10 shadow-sm"
            >
              <motion.div
                variants={fadeUpItem}
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12h4l3-9 5 18 3-9h5" />
                </svg>
              </motion.div>
              <motion.h2
                variants={fadeUpItem}
                className="text-2xl sm:text-3xl font-bold text-primary"
              >
                Visi
              </motion.h2>
              <motion.p
                variants={fadeUpItem}
                className="text-base leading-relaxed text-var(--text-muted)"
              >
                Membangun Karakter dengan semangat bermusyawarah melalui ilmu
                pengetahuan, etika, dan keahlian dalam bidang teknologi dan
                informasi serta menjadi wadah untuk menyatukan mahasiswa jurusan
                Teknik Informatika UNINUS dalam menunjang proses akademis dan
                non akademis.
              </motion.p>
            </motion.div>

            {/* Misi */}
            <motion.div
              variants={fadeUpContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="flex flex-col gap-5 p-8 rounded-3xl bg-var(--bg-card) border border-primary/10 shadow-sm"
            >
              <motion.div
                variants={fadeUpItem}
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </motion.div>
              <motion.h2
                variants={fadeUpItem}
                className="text-2xl sm:text-3xl font-bold text-primary"
              >
                Misi
              </motion.h2>
              <motion.ul
                variants={fadeUpContainer}
                className="flex flex-col gap-3 text-base text-var(--text-muted)"
              >
                {[
                  "Membentuk Mahasiswa yang bertaqwa kepada Tuhan Yang Maha Esa",
                  "Membentuk Karakter setiap anggota yang kreatif, inovatif, unggul, berwawasan luas, dan bertanggung jawab.",
                  "Mengembangkan potensi dalam diri setiap anggota Himatif baik dalam hardskill maupun softskill.",
                  "Membangun sifat kekeluargaan dan profesionalisme demi mencapai tujuan yang sama dan menghargai perbedaan.",
                ].map((misi, index) => (
                  <motion.li
                    key={index}
                    variants={fadeUpItem}
                    className="flex gap-3"
                  >
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{misi}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Sejarah Singkat ===== */}
      <section className="py-24 bg-var(--bg-page)">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full md:w-1/2"
            >
              <div className="relative w-full aspect-square sm:aspect-4/3 max-w-sm mx-auto md:max-w-none">
                <Image
                  src="/images/himatif-logo.png"
                  alt="Sejarah Himatif"
                  fill
                  className="object-contain drop-shadow-xl"
                />
              </div>
            </motion.div>

            <motion.div
              variants={fadeUpContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="w-full md:w-1/2 flex flex-col gap-6"
            >
              <motion.h2
                variants={fadeUpItem}
                className="text-3xl sm:text-4xl font-bold text-primary"
              >
                Sejarah Singkat
              </motion.h2>
              <motion.div
                variants={fadeUpItem}
                className="w-12 h-1 rounded-full bg-primary"
              />
              <motion.div
                variants={fadeUpItem}
                className="flex flex-col gap-4 text-base leading-relaxed text-var(--text-body)"
              >
                <p>
                  HIMATIF UNINUS didirikan di Kota Bandung pada tanggal 24 Maret
                  2018 sebagai organisasi kemahasiswaan Program Studi Teknik
                  Informatika Universitas Islam Nusantara. Organisasi ini
                  dibentuk untuk jangka waktu yang tidak ditetapkan dan
                  berfungsi sebagai wadah pengembangan akademik, keorganisasian,
                  serta penyaluran aspirasi mahasiswa Teknik Informatika secara
                  berkelanjutan.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
