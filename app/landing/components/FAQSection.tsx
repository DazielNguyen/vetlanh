import { ChevronDown } from "lucide-react";

export default function FAQSection() {
    return (
        <section className="py-24 bg-primary/5" id="faq">
            <div className="mx-auto max-w-[800px] px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-black md:text-4xl">Câu hỏi thường gặp</h2>
                    <p className="mt-4 text-muted-foreground">Giải đáp các thắc mắc phổ biến về chi phí và thanh toán trên nền tảng Vết Lành.</p>
                </div>
                <div className="space-y-4">
                    <details className="group rounded-2xl border border-border bg-card p-6">
                        <summary className="flex cursor-pointer items-center justify-between font-bold text-foreground">
                            <span>Ứng dụng Vết Lành có hoàn toàn miễn phí không?</span>
                            <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-4 text-sm leading-relaxed text-muted-foreground">
                            Vết Lành cung cấp các tính năng cơ bản hoàn toàn miễn phí như theo dõi tâm trạng bằng AI và tham gia diễn đàn cộng đồng. Tuy nhiên, các dịch vụ tư vấn chuyên sâu trực tiếp với chuyên gia thông qua mô hình C2C sẽ có phí dịch vụ tương ứng.
                        </div>
                    </details>

                    <details className="group rounded-2xl border border-border bg-card p-6">
                        <summary className="flex cursor-pointer items-center justify-between font-bold text-foreground">
                            <span>Chi phí cho một buổi tư vấn với chuyên gia là bao nhiêu?</span>
                            <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-4 text-sm leading-relaxed text-muted-foreground">
                            Chi phí tư vấn rất linh hoạt, do các chuyên gia tự thiết lập dựa trên trình độ và kinh nghiệm của họ. Mức giá thường dao động từ 200,000 VNĐ cho mỗi phiên trị liệu, giúp người dùng dễ dàng lựa chọn gói phù hợp với ngân sách cá nhân.
                        </div>
                    </details>

                    <details className="group rounded-2xl border border-border bg-card p-6">
                        <summary className="flex cursor-pointer items-center justify-between font-bold text-foreground">
                            <span>Làm thế nào để thanh toán cho các gói trị liệu?</span>
                            <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-4 text-sm leading-relaxed text-muted-foreground">
                            Chúng tôi hỗ trợ đa dạng các phương thức thanh toán an toàn bao gồm: ví điện tử (Momo, ZaloPay), chuyển khoản ngân hàng qua mã QR và hệ thống điểm tín dụng nội bộ của ứng dụng để tối ưu hóa quy trình giao dịch.
                        </div>
                    </details>

                    <details className="group rounded-2xl border border-border bg-card p-6">
                        <summary className="flex cursor-pointer items-center justify-between font-bold text-foreground">
                            <span>Tôi có được hoàn tiền nếu không hài lòng với buổi tư vấn?</span>
                            <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-4 text-sm leading-relaxed text-muted-foreground">
                            Vết Lành có chính sách hoàn tiền minh bạch dựa trên các tiêu chuẩn cộng đồng và đánh giá khách quan về chất lượng buổi tư vấn. Nếu có khiếu nại, đội ngũ hỗ trợ sẽ xem xét báo cáo từ cả người dùng và chuyên gia để đưa ra phán quyết công bằng nhất.
                        </div>
                    </details>
                </div>
            </div>
        </section>
    );
}
