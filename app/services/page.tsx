import ServicesHero from "./components/ServicesHero";
import ServicesGrid from "./components/ServicesGrid";
import ServicesCTA from "./components/ServicesCTA";

export const metadata = {
    title: "Dịch vụ",
    description: "Khám phá các dịch vụ chăm sóc và trị liệu tâm lý tại Vết Lành.",
};

export default function ServicesPage() {
    return (
        <>
            <ServicesHero />
            <ServicesGrid />
            <ServicesCTA />
        </>
    );
}
