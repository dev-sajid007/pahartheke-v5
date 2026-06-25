import Header from "@/components/common/header"
import Footer from "@/components/common/footer"

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#faf7f0] py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a2e1a] mb-8">Terms of Use</h1>
          <div className="prose prose-green max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>By using the Pahar Theke website and services, you agree to the following terms and conditions.</p>
            <h2 className="text-xl font-bold text-[#1a2e1a] mt-8">Account Responsibility</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
            <h2 className="text-xl font-bold text-[#1a2e1a] mt-8">Product Information</h2>
            <p>We strive to display accurate product information, pricing, and availability. However, we reserve the right to correct errors and modify listings.</p>
            <h2 className="text-xl font-bold text-[#1a2e1a] mt-8">Orders & Payments</h2>
            <p>All orders are subject to acceptance and availability. We reserve the right to cancel orders at our discretion with full refund.</p>
            <h2 className="text-xl font-bold text-[#1a2e1a] mt-8">Limitation of Liability</h2>
            <p>Pahar Theke is not liable for indirect damages arising from the use of our products or services beyond the purchase price.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
