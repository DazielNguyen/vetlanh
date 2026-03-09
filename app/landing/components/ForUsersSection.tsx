export default function ForUsersSection() {
    return (
        <section className="py-24" id="nguoi-dung">
            <div className="mx-auto max-w-[1200px] px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-black md:text-4xl">Giải pháp cho Người dùng</h2>
                    <p className="mt-4 text-muted-foreground">Không gian an toàn để bạn chia sẻ và nhận sự hỗ trợ kịp thời.</p>
                </div>
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="overflow-hidden rounded-3xl bg-card shadow-sm border border-border/50 transition-all hover:shadow-lg">
                        <div className="aspect-video w-full bg-secondary/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBTfFjXN9OnEPzdw9qhNK7SQQZud5ijRljSOLuaOAblwFC5NJtGDSpjcxg0vWetIXL77gBa-8KT4ykuveCGmrLXDGG6pjfl18vQgjtqhgIO7DTfS2FdZC2Ji_VWg4EdaAKvjNfd19Fe-8ksn98dHoBfToraAD0RXpaT1TbMbVT0Z0-A610yR3fcSBiQKo8F10cKLL-KMFVCCEak5jd2wSLknHSsX5SM38RPDXzSF-vXnAqC5yVKyIoHo6wJWS1yvKCHhmSy9gzw04g")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div className="p-8">
                            <h4 className="mb-3 text-lg font-bold">Bảo mật tuyệt đối</h4>
                            <p className="text-sm text-muted-foreground">Dữ liệu cá nhân và lịch sử tư vấn được mã hóa đầu cuối, đảm bảo quyền riêng tư cao nhất.</p>
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-3xl bg-card shadow-sm border border-border/50 transition-all hover:shadow-lg">
                        <div className="aspect-video w-full bg-secondary/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDXRysgZAFS2eadINUcyqH6x1-BJLnljSjV6R5-9HfXKcT49ZWSztKm5GH6IICfgDkpPbLWPGOhQ2Yd8VvUL-WJjMxPtlXiPPsZYAJdsr_bwuPEQ1P8WUxubnEDI9Y3uqE03gxQUVYaYbdqO-7Z0-PQN3RJHR2eZIbeZmtG_zYXC6VcPc46qq_KxzzytrgzMgQrvZ3XiLKRltdYIiwHEIGzzV4TZzXPnoAt2vORtgDP89NwFBIGfv8OTUdBWuoajzFQH-cURWSxTNU")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div className="p-8">
                            <h4 className="mb-3 text-lg font-bold">Truy cập nhanh chóng</h4>
                            <p className="text-sm text-muted-foreground">Hỗ trợ 24/7, đặt lịch hẹn và kết nối chuyên gia chỉ với vài thao tác đơn giản trên ứng dụng.</p>
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-3xl bg-card shadow-sm border border-border/50 transition-all hover:shadow-lg">
                        <div className="aspect-video w-full bg-secondary/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBkxZFzX9z4BrZ-r73k49gnULs_tpLFnxGcvtG1lRKLMD3aGPbKhAeeOrx16OVp_4bG_tHxJElObgiXNROaIPoh7ORTgZjhOyZWViax4tbeaHnWPX1Vtf9Oh6rTpZ0DA73XjWS6q8_J1tBvqGtwlB2Y6J7q-RwiElZt9kB_2-4r-S54uDLhy8EFNmAOAbzoOCfq57f892jakypri-X2gKUsFniTr2kJ19txoUcxcTJvAh6lu9SWTpVLDEKVBUmVclOtfhsUJmm2KmI")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div className="p-8">
                            <h4 className="mb-3 text-lg font-bold">AI thấu cảm</h4>
                            <p className="text-sm text-muted-foreground">Công nghệ AI phản hồi tự nhiên, gần gũi và thấu cảm như một người bạn đồng hành tin cậy.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
