"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getSection } from "@/services/landing"

export default function Footer() {
  const [data, setData] = useState(null)
  const year = new Date().getFullYear()

  useEffect(() => {
    getSection("home", "footer").then((s) => {
      if (s?.content) {
        try {
          setData(JSON.parse(s.content))
        } catch {}
      }
    }).catch(() => {})
  }, [])

  if (!data) return null

  const {
    logoUrl,
    description,
    socialLinks = [],
    quickLinks = [],
    policies = [],
    quickLinksTitle = "Quick Links",
    policiesTitle = "Policies",
    contactTitle = "Contact Us",
    copyrightText = "© {year} PaharTheke. All rights reserved.",
    copyrightCredit = "Designed & Developed in Bangladesh",
    address,
    phone,
    email,
    mapEmbedUrl,
  } = data

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
            {logoUrl && (
              <img src={logoUrl} className="w-28 h-auto" />
            )}

            {description && (
              <p className="text-sm text-gray-400 leading-relaxed">
                {description}
              </p>
            )}

            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm"
                    style={{ backgroundColor: link.color || "#666" }}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {quickLinks.length > 0 && (
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
                {quickLinksTitle}
              </h3>

              <ul className="flex flex-col gap-3">
                {quickLinks.map((link) => (
                  <li key={link.id}>
                    <Link href={link.href} className="text-gray-400 hover:text-white text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {policies.length > 0 && (
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
                {policiesTitle}
              </h3>

              <ul className="flex flex-col gap-3">
                {policies.map((policy) => (
                  <li key={policy.id}>
                    <Link href={policy.href} className="text-gray-400 hover:text-white text-sm">
                      {policy.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
              {contactTitle}
            </h3>

            {address && (
              <p className="text-sm text-gray-400 leading-relaxed mb-4 whitespace-pre-line">
                {address}
              </p>
            )}

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
          <p>{copyrightText.replace("{year}", year)}</p>
          <p>{copyrightCredit}</p>
        </div>
      </div>

    </div>
  )
}
