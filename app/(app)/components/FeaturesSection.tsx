import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Heart, Users, Target, Shield } from "lucide-react"

export default function FeaturesSection() {
    const features = [
        {
            title: "Chuyên Gia Đáng Tin Cậy",
            description: "Đội ngũ chuyên gia tâm lý học có nhiều năm kinh nghiệm, luôn lắng nghe và đồng hành cùng bạn.",
            icon: <Target className="w-6 h-6 text-primary" />
        },
        {
            title: "Riêng Tư & An Toàn",
            description: "Mọi thông tin của bạn được bảo mật tuyệt đối. Chúng tôi tôn trọng quyền riêng tư của bạn.",
            icon: <Shield className="w-6 h-6 text-primary" />
        },
        {
            title: "Cộng Đồng Gắn Kết",
            description: "Chia sẻ câu chuyện của bạn hoặc học hỏi từ những người đang cùng chung trải nghiệm vượt qua khó khăn.",
            icon: <Users className="w-6 h-6 text-primary" />
        },
        {
            title: "Phương Pháp Trị Liệu",
            description: "Các khóa học và liệu trình được cá nhân hóa phù hợp với tinh thần và thời gian của bạn.",
            icon: <Heart className="w-6 h-6 text-primary" />
        }
    ]

    return (
        <section id="features" className="w-full py-16 md:py-24 bg-secondary">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">Dịch Vụ Nổi Bật</h2>
                    <p className="mt-4 text-muted-foreground">
                        Chúng tôi ở đây để mang đến những hỗ trợ tốt nhất cho hành trình phục hồi sức khoẻ tinh thần của bạn.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feat, index) => (
                        <Card key={index} className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    {feat.icon}
                                </div>
                                <CardTitle className="text-xl">{feat.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base text-muted-foreground">{feat.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
