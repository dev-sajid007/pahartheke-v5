import Header from "@/components/common/header"
import Footer from "@/components/common/footer"

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#faf7f0] py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a2e1a] mb-8">Privacy Policy</h1>
          <div className="prose prose-green max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>At Pahar Theke, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.</p>
            <h2 className="text-xl font-bold text-[#1a2e1a] mt-8">Information We Collect</h2>
            <p>We collect information you provide when registering, placing orders, or contacting us — including name, email, phone number, and delivery address.</p>
            <h2 className="text-xl font-bold text-[#1a2e1a] mt-8">How We Use Your Information</h2>
            <p>Your information is used solely for order processing, delivery, customer support, and improving our services. We never sell your data to third parties.</p>
            <h2 className="text-xl font-bold text-[#1a2e1a] mt-8">Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal data during transmission and storage.</p>
            <h2 className="text-xl font-bold text-[#1a2e1a] mt-8">Contact</h2>
            <p>For privacy-related inquiries, email us at pahar.theke@gmail.com or call 01531532139.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
