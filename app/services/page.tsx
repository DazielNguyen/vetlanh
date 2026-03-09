import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServicesHero from "./components/ServicesHero";
import ServicesGrid from "./components/ServicesGrid";
import ServicesCTA from "./components/ServicesCTA";

export const metadata = {
    title: "Dịch vụ",
    description: "Khám phá các dịch vụ chăm sóc và trị liệu tâm lý tại Vết Lành.",
};

export default function ServicesPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 overflow-x-hidden">
                <ServicesHero />
                <ServicesGrid />
                <ServicesCTA />
            </main>
            <Footer />
        </div>
    );
}
