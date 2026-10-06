import type { Metadata } from "next";
import { container } from "@/components/ui/container";
import { BenefitsStrip } from "@/features/home/benefits-strip";
import { FeaturedCars } from "@/features/home/featured-cars";
import { Hero } from "@/features/home/hero";
import { RentalBanner } from "@/features/home/rental-banner";
import { SellYourCar } from "@/features/pedidos/sell-your-car";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="bg-light pt-8">
        <BenefitsStrip />
        <FeaturedCars />
      </div>
      <RentalBanner />
      <section aria-labelledby="vender-titulo" className="bg-light py-16 sm:py-20">
        <div className={container}>
          <SellYourCar />
        </div>
      </section>
    </>
  );
}
