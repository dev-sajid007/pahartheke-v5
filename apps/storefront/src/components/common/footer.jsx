"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getSection } from "@/lib/api/landing-page";

const DEFAULTS = {
  logoUrl: "https://pahartheke.com/assets/img/logo.png",
  description:
    "Online platform revolutionizing food industry by promoting ancient cultivation and sustainable agriculture. Supporting underprivileged hill tract farmers.",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  youtubeUrl: "https://youtube.com",
  quickLinks: [
    { label: "About Us", href: "/about" },
    { label: "Track Order", href: "/track-order" },
  ],
  policies: [],
  address: "House - 2/5, Road - 2 Block-F,\nLalmatia, Dhaka-1207, Bangladesh.\n02-223311311, 01531532139",
  phone: "01531532139",
  email: "pahar.theke@gmail.com",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=YOUR_EMBED_URL",
  paymentBannerUrl: "",
  copyrightText: "",
};

export default function Footer() {
  const year = new Date().getFullYear()
  const [data, setData] = useState(DEFAULTS);

  useEffect(() => {
    getSection("home", "footer").then((s) => {
      if (s?.content) {
        try {
          const parsed = JSON.parse(s.content);
          setData({ ...DEFAULTS, ...parsed });
        } catch { }
      }
    }).catch(() => { });
  }, []);

  const {
    logoUrl,
    description,
    facebookUrl,
    instagramUrl,
    youtubeUrl,
    quickLinks,
    policies,
    address,
    phone,
    email,
    mapEmbedUrl,
    paymentBannerUrl,
    copyrightText,
  } = data;

  const bannerSrc = paymentBannerUrl || "/images/footer-pg.png";

  return (
    <div className="bg-[#76B432]">

      <div className="border-t border-white/20 py-4 px-6">
        <div className="w-full">
          <img
            src={bannerSrc}
            alt="Payment Banner"
            className="w-full h-full object-contain md:object-cover"
          />
        </div>
      </div>

      <div className="py-12 px-6 border-t border-white/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <div className="flex flex-col gap-5">
            <img src={logoUrl} className="w-28 h-auto" />

            <p className="text-sm text-white leading-relaxed">
              {description}
            </p>

            <div className="flex gap-3">
              {facebookUrl && (
                <a className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm"
                  href={facebookUrl} target="_blank" rel="noopener noreferrer">f</a>
              )}
              {instagramUrl && (
                <a className="w-9 h-9 bg-pink-600 rounded-full flex items-center justify-center text-white text-sm"
                  href={instagramUrl} target="_blank" rel="noopener noreferrer">ig</a>
              )}
              {youtubeUrl && (
                <a className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center text-white text-sm"
                  href={youtubeUrl} target="_blank" rel="noopener noreferrer">yt</a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Quick Links
            </h3>

            <ul className="flex flex-col gap-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-white hover:text-white/80 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>



          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Contact Us
            </h3>

            <p className="text-sm text-white leading-relaxed mb-4 whitespace-pre-line">
              {address}
            </p>

            {mapEmbedUrl && (
              <iframe
                src={mapEmbedUrl}
                className="w-full h-[150px] rounded-lg border border-white/20 mb-4"
                loading="lazy"
                title="map"
              />
            )}

            {phone && (
              <a href={`tel:${phone}`}
                className="block w-fit bg-[#171F24] text-white px-4 py-2 rounded-full text-sm mb-3 hover:bg-black transition-colors">
                {phone}
              </a>
            )}

            {email && (
              <a href={`mailto:${email}`}
                className="block w-fit bg-[#171F24] text-white px-4 py-2 rounded-full text-sm hover:bg-black transition-colors">
                {email}
              </a>
            )}
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/20 py-4 px-6">
        <p className="text-center text-xs text-white">
          {copyrightText || `© ${year} Pahar Theke. All rights reserved.`}
        </p>
      </div>

    </div>
  )
}