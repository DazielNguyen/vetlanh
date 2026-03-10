import { ChevronDown } from "lucide-react";

export default function FAQSection() {
    return (
        <section className="py-24 bg-white" id="faq">
            <div className="mx-auto max-w-[800px] px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Câu hỏi thường gặp</h2>
                    <p className="mt-4 text-slate-500 text-lg">Giải đáp các thắc mắc về cách <span className="font-dancing font-bold text-[1.1em]">Vết Lành</span> đồng hành cùng bạn.</p>
                </div>
                <div className="space-y-4">
                    <details className="group rounded-[24px] border border-slate-100 bg-[#FAFDFB] p-6 hover:shadow-sm transition-shadow">
                        <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-800 text-lg">
                            <span>Ứng dụng <span className="font-dancing font-bold text-[1.1em]">Vết Lành</span> có hoàn toàn miễn phí không?</span>
                            <ChevronDown className="h-5 w-5 text-emerald-600 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-4 text-base leading-relaxed text-slate-600">
                            <span className="font-dancing font-bold text-[1.1em]">Vết Lành</span> cung cấp các tính năng cơ bản hoàn toàn miễn phí như theo dõi tâm trạng bằng AI và tham gia diễn đàn cộng đồng. Tuy nhiên, các dịch vụ tư vấn chuyên sâu trực tiếp với chuyên gia thông qua mô hình C2C sẽ có phí dịch vụ tương ứng.
                        </div>
                    </details>

                    <details className="group rounded-[24px] border border-slate-100 bg-[#FAFDFB] p-6 hover:shadow-sm transition-shadow">
                        <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-800 text-lg">
                            <span>Chi phí cho một buổi tư vấn với chuyên gia là bao nhiêu?</span>
                            <ChevronDown className="h-5 w-5 text-emerald-600 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-4 text-base leading-relaxed text-slate-600">
                            Chi phí tư vấn rất linh hoạt, do các chuyên gia tự thiết lập dựa trên trình độ và kinh nghiệm của họ. Mức giá thường dao động từ 200,000 VNĐ cho mỗi phiên trị liệu, giúp người dùng dễ dàng lựa chọn gói phù hợp với ngân sách cá nhân.
                        </div>
                    </details>

                    <details className="group rounded-[24px] border border-slate-100 bg-[#FAFDFB] p-6 hover:shadow-sm transition-shadow">
                        <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-800 text-lg">
                            <span>Làm thế nào để thanh toán cho các gói trị liệu?</span>
                            <ChevronDown className="h-5 w-5 text-emerald-600 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-4 text-base leading-relaxed text-slate-600">
                            Chúng tôi hỗ trợ đa dạng các phương thức thanh toán an toàn bao gồm: ví điện tử (Momo, ZaloPay), chuyển khoản ngân hàng qua mã QR và hệ thống điểm tín dụng nội bộ của ứng dụng để tối ưu hóa quy trình giao dịch.
                        </div>
                    </details>

                    <details className="group rounded-[24px] border border-slate-100 bg-[#FAFDFB] p-6 hover:shadow-sm transition-shadow">
                        <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-800 text-lg">
                            <span>Tôi có được hoàn tiền nếu không hài lòng với buổi tư vấn?</span>
                            <ChevronDown className="h-5 w-5 text-emerald-600 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-4 text-base leading-relaxed text-slate-600">
                            <span className="font-dancing font-bold text-[1.1em]">Vết Lành</span> có chính sách hoàn tiền minh bạch dựa trên các tiêu chuẩn cộng đồng và đánh giá khách quan về chất lượng buổi tư vấn. Nếu có khiếu nại, đội ngũ hỗ trợ sẽ xem xét báo cáo từ cả người dùng và chuyên gia để đưa ra phán quyết công bằng nhất.
                        </div>
                    </details>
                </div>
            </div>
        </section>
    );
}
