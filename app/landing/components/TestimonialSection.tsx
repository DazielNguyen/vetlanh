export default function TestimonialSection() {
    return (
        <section className="py-24 bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-foreground mb-4">Câu chuyện từ những người bạn của Vết Lành</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Testimonial 1 */}
                    <div className="bg-background p-8 rounded-2xl relative shadow-sm border border-border/40">
                        <div className="flex items-center gap-4 mb-6">
                            <img alt="User 1" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw2d6rJFFUxynNQkkorf5gkA6eFOPkzKLZgVR7zldo4b70rDZfSGMBJLCi_SG3v-ElqIraH_IYil-pFW_f4IrScMHmpQN74oE7IaKbq-enBAb9Ecq6IW7WtwKuIPVBw9xlWgs_aEaEbC1UWFp1sNwUCxg2YEOZvjv87b-uhoNb1i1ZYiCpDmNHnVgyJ2IYHk_8QKob_sbebteovbmCtJXpGoH8CBOeKjhtEp_sZCeu_bpehiY8jQ-u5-W7zoD0Ane6VAwiWuypjD3Z" />
                            <div>
                                <h5 className="font-bold text-foreground">Minh Anh</h5>
                                <p className="text-xs text-slate-400">@minhanh_9x</p>
                            </div>
                        </div>
                        <p className="text-slate-600 italic leading-relaxed">"Vết Lành giúp mình vượt qua những đêm mất ngủ vì stress công việc. Podcast thiền thực sự rất hiệu quả."</p>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="bg-background p-8 rounded-2xl relative shadow-sm border border-border/40">
                        <div className="flex items-center gap-4 mb-6">
                            <img alt="User 2" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjZJ90hrWYeFOTb32y4vO7L5Px8t0uCsjzcJaxZjaskUxuZd7m5S1bMYwLuIIlkzZ82SoauyKETqdLRwJkbtSsAHeKaEMxENvXVZPGb7W_8E_Idf7EH6cC_0T9ymgTotBtsGD7RKcFourdGXKYsujFj27oAqXi_bO1loPcSwEshKDNr90X0UXcARBn-tyHSzmOCJz382eCD9Kxv3Q7dg0KzEZqjjchiyxR8QsKeMMlOZRDSC1MLrn4HnaoO7WJ0wPuRhk6Xc-LbaEA" />
                            <div>
                                <h5 className="font-bold text-foreground">Hoàng Nam</h5>
                                <p className="text-xs text-slate-400">@nam_healing</p>
                            </div>
                        </div>
                        <p className="text-slate-600 italic leading-relaxed">"Giao diện thân thiện và cảm giác rất an tâm khi sử dụng. Chatbot AI trả lời rất thông minh và thấu hiểu."</p>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="bg-background p-8 rounded-2xl relative shadow-sm border border-border/40">
                        <div className="flex items-center gap-4 mb-6">
                            <img alt="User 3" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjtNlsgwkbfYzDjKMRD4vHxzF6HRmpnmQ8_zUT1scNVvhUrgvb-P9feFJjwVfzaHkLdrfdVIvAyDWdFtPKWCDZfjReRo2l7CpX4_OjEV74XPu5g02lXG6zOg5DDwnOthx7U0LjqjcZ-LKv1XcbvFpUfzcQnaoDZ7iOGM3_CmdJqebxTt1pADR-pAw-43AcxyBiKZyqov6koR1nWln9P354Rm49zcnZ8gB1dXT2HuFAdh0S0NxqGj3XcjvhoUetumutMpgSUr-sndzt" />
                            <div>
                                <h5 className="font-bold text-foreground">Thanh Trúc</h5>
                                <p className="text-xs text-slate-400">@truc_zen</p>
                            </div>
                        </div>
                        <p className="text-slate-600 italic leading-relaxed">"Việc kết nối với chuyên gia chưa bao giờ dễ dàng và riêng tư đến thế. Cảm ơn Vết Lành rất nhiều!"</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
