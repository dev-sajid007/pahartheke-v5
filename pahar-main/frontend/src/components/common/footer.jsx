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
  policies: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "FAQs", href: "/faqs" },
    { label: "Terms of use", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
  address: "House - 2/5, Road - 2 Block-F,\nLalmatia, Dhaka-1207, Bangladesh.\n02-223311311, 01531532139",
  phone: "01531532139",
  email: "pahar.theke@gmail.com",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=YOUR_EMBED_URL",
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
        } catch {}
      }
    }).catch(() => {});
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
  } = data;

  return (
    <div className="bg-[#1a3a1a]">

      <div className="border-t border-green-900 py-4 px-6">
        <div className="w-full">
          <img
            src="/images/footer-pg.png"
            alt="Payment Banner"
            className="w-full h-full object-contain md:object-cover"
          />
        </div>
      </div>

      <div className="py-12 px-6 border-t border-green-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <div className="flex flex-col gap-5">
            <img src={logoUrl} className="w-28 h-auto" />

            <p className="text-sm text-gray-400 leading-relaxed">
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
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Policies
            </h3>

            <ul className="flex flex-col gap-3">
              {policies.map((policy, i) => (
                <li key={i}>
                  <Link href={policy.href} className="text-gray-400 hover:text-white text-sm">
                    {policy.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Contact Us
            </h3>

            <p className="text-sm text-gray-400 leading-relaxed mb-4 whitespace-pre-line">
              {address}
            </p>

            {mapEmbedUrl && (
              <iframe
                src={mapEmbedUrl}
                className="w-full h-[150px] rounded-lg border border-green-900 mb-4"
                loading="lazy"
                title="map"
              />
            )}

            {phone && (
              <a href={`tel:${phone}`}
                className="block w-fit bg-green-700 text-white px-4 py-2 rounded-full text-sm mb-3">
                {phone}
              </a>
            )}

            {email && (
              <a href={`mailto:${email}`}
                className="block w-fit bg-green-700 text-white px-4 py-2 rounded-full text-sm">
                {email}
              </a>
            )}
          </div>

        </div>
      </div>

      <div className="bg-[#122a12] border-t border-green-900 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <p>&copy; {year} PaharTheke. All rights reserved.</p>
          <p>Designed &amp; Developed in Bangladesh</p>
        </div>
      </div>

    </div>
  )
}
