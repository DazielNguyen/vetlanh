import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import ForUsersSection from "./components/ForUsersSection";
import ForExpertsSection from "./components/ForExpertsSection";
import PricingSection from "./components/PricingSection";
import MissionSection from "./components/MissionSection";
import FAQSection from "./components/FAQSection";

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 overflow-x-hidden">
                <HeroSection />
                <HowItWorksSection />
                <ForUsersSection />
                <ForExpertsSection />
                <PricingSection />
                <MissionSection />
                <FAQSection />
            </main>
            <Footer />
        </div>
    );
}
