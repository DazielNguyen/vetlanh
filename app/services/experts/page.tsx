import { ExpertsSearch } from "./components/ExpertsSearch";
import { FeaturedExperts } from "./components/FeaturedExperts";
import { ExpertsList } from "./components/ExpertsList";

export const metadata = {
    title: "Chuyên gia - VẾT LÀNH",
    description: "Tìm kiếm và kết nối với các chuyên gia tâm lý hàng đầu.",
};

export default function ExpertsPage() {
    return (
        <div className="w-full pb-10 space-y-10">
            <ExpertsSearch />
            <FeaturedExperts />
            <ExpertsList />
        </div>
    );
}
