import Header from "@/components/common/header"
import HeroSection from "@/components/home/hero-section"
import FeaturedProducts from "@/components/home/featured-products"
import EarnMoneySection from "@/components/home/affeliate-banner"
import InvestSection from "@/components/home/invest-banner"
import WhyBengalMeatSection from "@/components/home/about"
import CustomerReviewSection from "@/components/home/customer-review"
import Footer from "@/components/common/footer"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        
        <HeroSection />
        <FeaturedProducts />
        <EarnMoneySection />
        <InvestSection />
        <WhyBengalMeatSection />
        <CustomerReviewSection />
      </main>
      <Footer/>
    </>
  )
}