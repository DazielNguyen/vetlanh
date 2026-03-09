import { UpcomingAppointments } from "./components/UpcomingAppointments";
import { PastAppointments } from "./components/PastAppointments";
import { AppointmentSidebar } from "./components/AppointmentSidebar";

export default function ExercisesPage() {
    return (
        <div className="w-full pb-10 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Lịch hẹn</h1>
                <p className="text-slate-500 mt-1">Quản lý và theo dõi các buổi tư vấn của bạn.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Appointments */}
                <div className="lg:col-span-2 space-y-8">
                    <UpcomingAppointments />
                    <PastAppointments />
                </div>

                {/* Right: Calendar + Quick Book */}
                <AppointmentSidebar />
            </div>
        </div>
    );
}
