import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import JourneySection from "./components/JourneySection";
import TestimonialSection from "./components/TestimonialSection";
import PartnersSection from "./components/PartnersSection";
import PricingSection from "./components/PricingSection";
import FAQSection from "./components/FAQSection";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 overflow-x-hidden">
                <HeroSection />
                <FeaturesSection />
                <JourneySection />
                <TestimonialSection />
                <PartnersSection />
                <PricingSection />
                <FAQSection />
            </main>
            <Footer />
        </div>
    );
}
