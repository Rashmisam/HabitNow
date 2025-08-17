import { useAuth } from "@getmocha/users-service/react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import Header from "@/react-app/components/Header";
import HabitOverview from "@/react-app/components/HabitOverview";
import QuickActions from "@/react-app/components/QuickActions";
import TodayProgress from "@/react-app/components/TodayProgress";
import OfflineIndicator from "@/react-app/components/OfflineIndicator";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user, isPending } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !user) {
      navigate("/");
    }
  }, [user, isPending, navigate]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="animate-spin">
          <Loader2 className="w-10 h-10 text-indigo-600" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <OfflineIndicator />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.google_user_data.given_name || user.email}!
          </h1>
          <p className="text-gray-600">
            Let's make today count. Track your daily progress and build consistent habits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TodayProgress />
            <HabitOverview />
          </div>
          
          <div className="space-y-8">
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}
