import Header from "@/components/common/header"
import Footer from "@/components/common/footer"

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#faf7f0] py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a2e1a] mb-8">Refund Policy</h1>
          <div className="prose prose-green max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>We want you to be satisfied with every purchase from Pahar Theke. Here is our refund policy.</p>
            <h2 className="text-xl font-bold text-[#1a2e1a] mt-8">Damaged or Defective Products</h2>
            <p>If you receive damaged or defective products, please contact us within 24 hours of delivery with photo evidence. We will issue a full refund or replacement.</p>
            <h2 className="text-xl font-bold text-[#1a2e1a] mt-8">Wrong Items Delivered</h2>
            <p>If you receive incorrect items, we will arrange pickup and deliver the correct items at no extra charge.</p>
            <h2 className="text-xl font-bold text-[#1a2e1a] mt-8">Perishable Goods</h2>
            <p>Due to the perishable nature of food products, returns are generally not accepted unless the item arrives damaged.</p>
            <h2 className="text-xl font-bold text-[#1a2e1a] mt-8">Refund Processing</h2>
            <p>Approved refunds are processed within 5-7 business days to the original payment method.</p>
            <h2 className="text-xl font-bold text-[#1a2e1a] mt-8">Contact</h2>
            <p>For refund requests: call 01531532139 or email pahar.theke@gmail.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
