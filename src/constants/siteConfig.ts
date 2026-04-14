export const siteConfig = {
  name: "Himatif Uninus",
  fullName: "Himpunan Mahasiswa Teknik Informatika",
  university: "Universitas Islam Nusantara",
  acronym: "Himatif Uninus",
  description:
    "Himpunan Mahasiswa Teknik Informatika Universitas Islam Nusantara — wadah pengembangan akademik, kreativitas, dan kepemimpinan mahasiswa informatika.",
  url: "https://himatif-uninus.org",
  logo: "/public/images/himatif-logo.svg",
  logoAlt: "Logo Himatif Uninus",
  email: "himatif@uninus.ac.id",
  phone: "+62 xxx-xxxx-xxxx",
  address: "Jl. Soekarno Hatta No.530, Bandung, Jawa Barat",
  foundedYear: 2010,
  socialMedia: {
    instagram: "https://instagram.com/himatif_uninus",
    twitter: "https://twitter.com/himatif_uninus",
    youtube: "https://youtube.com/@himatif_uninus",
    github: "https://github.com/himatif-uninus",
    linkedin: "https://linkedin.com/company/himatif-uninus",
  },
  seo: {
    defaultTitle: "Himatif Uninus",
    titleTemplate: "%s | Himatif Uninus",
    defaultDescription:
      "Himpunan Mahasiswa Teknik Informatika Universitas Islam Nusantara — wadah pengembangan akademik, kreativitas, dan kepemimpinan mahasiswa informatika.",
    keywords: [
      "Himatif",
      "Uninus",
      "Teknik Informatika",
      "Universitas Islam Nusantara",
      "Himpunan Mahasiswa",
      "Bandung",
    ],
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: "Himatif Uninus",
      defaultImage: "/images/og/og-default.png",
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
