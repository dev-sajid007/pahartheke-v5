import Header from "@/components/common/header"
import HeroSection from "@/components/home/hero-section"
import FeaturedProducts from "@/components/home/featured-products"
import BestSellers from "@/components/home/best-sellers"
import PopularItems from "@/components/home/popular-items"
import EarnMoneySection from "@/components/home/affeliate-banner"
import InvestSection from "@/components/home/invest-banner"
import CustomerReviewSection from "@/components/home/customar-review"
import Footer from "@/components/common/footer"
import WhyUs from "@/components/home/about"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <BestSellers />
        <PopularItems />
        <EarnMoneySection />
        <InvestSection />
        <WhyUs />
        <CustomerReviewSection />
      </main>
      <Footer />
    </>
  )
}