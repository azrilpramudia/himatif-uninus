export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqData: FaqItem[] = [
  {
    id: "1",
    question: "Apa itu Himatif Uninus?",
    answer:
      "Himatif (Himpunan Mahasiswa Teknik Informatika) Uninus adalah organisasi mahasiswa di tingkat program studi yang berfungsi sebagai wadah untuk menyalurkan aspirasi, kreativitas, serta mengembangkan minat dan bakat mahasiswa Teknik Informatika Universitas Islam Nusantara.",
  },
  {
    id: "2",
    question: "Bagaimana cara bergabung menjadi pengurus Himatif?",
    answer:
      "Rekrutmen pengurus (Open Recruitment) biasanya diadakan setiap awal periode kepengurusan baru (setelah masa orientasi/Makrab). Informasi pendaftaran akan diumumkan secara resmi melalui akun Instagram Himatif dan grup angkatan.",
  },
  {
    id: "3",
    question: "Apa saja keuntungan bergabung dengan Himatif?",
    answer:
      "Selain menambah relasi dan melatih soft skill (kepemimpinan, kerja sama tim, problem solving), kamu juga bisa mendapatkan akses lebih cepat ke informasi akademik, mengikuti pelatihan/workshop khusus, dan membangun portofolio berorganisasi yang berguna untuk dunia kerja.",
  },
  {
    id: "4",
    question: "Apakah kegiatan Himatif mengganggu waktu kuliah?",
    answer:
      "Tentu saja tidak. Kegiatan Himatif dirancang untuk saling melengkapi dengan aktivitas akademik. Rapat dan proker biasanya dijadwalkan di luar jam perkuliahan, sehingga mahasiswa tetap bisa memprioritaskan studinya.",
  },
  {
    id: "5",
    question: "Siapa saja yang bisa mengikuti event/acara Himatif?",
    answer:
      "Sebagian besar event (seperti seminar dan workshop) terbuka untuk seluruh mahasiswa Teknik Informatika Uninus, dan beberapa acara besar bahkan dibuka untuk umum. Syarat kepesertaan selalu dicantumkan pada poster setiap acara.",
  },
];
