import Link from "next/link";
import {
  Image,
  BadgeDollarSign,
  TrendingUp,
  Info,
  Star,
  ArrowRight,
  Globe,
  Footprints,
  ShoppingBag,
  Truck,
  LayoutGrid,
} from "lucide-react";

const sections = [
  {
    href: "/hero",
    label: "Hero Section",
    description: "Edit the homepage hero video and call-to-action button text.",
    icon: Image,
    color: "bg-blue-500",
  },
  {
    href: "/affiliate",
    label: "Affiliate Banner",
    description: "Manage the 'Earn Money With Us' section — title, background, steps.",
    icon: BadgeDollarSign,
    color: "bg-green-500",
  },
  {
    href: "/invest",
    label: "Invest Banner",
    description: "Update the 'Invest With Us' section title, features and CTA button.",
    icon: TrendingUp,
    color: "bg-purple-500",
  },
  {
    href: "/about",
    label: "About Section",
    description: "Edit the 'কেন পাহাড় থেকে' heading, description and process steps.",
    icon: Info,
    color: "bg-orange-500",
  },
  {
    href: "/reviews",
    label: "Customer Reviews",
    description: "Add, edit or remove customer testimonials shown on the homepage.",
    icon: Star,
    color: "bg-yellow-500",
  },
  {
    href: "/footer",
    label: "Footer",
    description: "Manage footer content — links, social media, contact info.",
    icon: Footprints,
    color: "bg-teal-500",
  },
  {
    href: "/product-sections",
    label: "Product Sections",
    description: "Edit the title and subtitle of Featured Products, Best Sellers, and Popular Items sections.",
    icon: LayoutGrid,
    color: "bg-indigo-500",
  },
  {
    href: "/orders",
    label: "Orders",
    description: "View and manage customer orders placed from the checkout page.",
    icon: ShoppingBag,
    color: "bg-rose-500",
  },
  {
    href: "/delivery",
    label: "Delivery Charges",
    description: "Set delivery zone names and prices shown on the checkout page.",
    icon: Truck,
    color: "bg-cyan-500",
  },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Frontend Content Manager</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage all homepage sections. Changes go live immediately after saving.
        </p>
      </div>

      {/* Live site link */}
      <a
        href="http://localhost:3000"
        target="_blank"
        rel="noreferrer"
        className="mb-8 inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-600 transition hover:border-[#fdc700] hover:text-[#1a1a2e]"
      >
        <Globe className="h-4 w-4" />
        View Live Frontend
        <ArrowRight className="h-3.5 w-3.5" />
      </a>

      {/* Section cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map(({ href, label, description, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-[#fdc700]"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1a1a2e] group-hover:text-[#c49f00]">
                {label}
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>
            </div>
            <div className="mt-auto flex items-center gap-1 text-xs font-medium text-[#fdc700]">
              Edit section <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* Info box */}
      <div className="mt-10 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-700">
        <strong>Note:</strong> Products and categories are managed directly via the external API (pahartheke.com). Orders placed on the storefront are saved and viewable here.
      </div>
    </div>
  );
}
