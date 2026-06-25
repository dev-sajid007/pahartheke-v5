import Header from "@/components/common/header"
import Footer from "@/components/common/footer"

const FAQS = [
  { q: "How do I place an order?", a: "Browse products, add to cart, and proceed to checkout. Fill in your delivery details and choose a payment method." },
  { q: "What payment methods are accepted?", a: "We accept Cash on Delivery, bKash, Nagad, and bank transfers." },
  { q: "How long does delivery take?", a: "Delivery within Dhaka takes 24-48 hours. Outside Dhaka may take 2-4 business days depending on location." },
  { q: "Do you deliver outside Dhaka?", a: "Yes, we deliver to all 64 districts of Bangladesh through our courier partners." },
  { q: "Can I return or exchange products?", a: "Food items are non-returnable for safety reasons. If you receive damaged goods, contact us within 24 hours for a refund." },
  { q: "Is there a minimum order amount?", a: "No minimum order. However, delivery charges apply for orders below a certain amount depending on your area." },
]

export default function FAQsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#faf7f0] py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a2e1a] mb-8">Frequently Asked Questions</h1>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <details key={i} className="bg-white rounded-xl border border-[#e2ead8] p-5 group">
                <summary className="font-semibold text-[#1a2e1a] cursor-pointer text-lg">{faq.q}</summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
