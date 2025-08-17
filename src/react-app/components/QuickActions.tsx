import { Plus, Calendar, BarChart3, Settings } from "lucide-react";
import { useState } from "react";
import CreateHabitModal from "./CreateHabitModal";

export default function QuickActions() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const quickActions = [
    {
      icon: <Plus className="w-5 h-5" />,
      label: "Add Daily Habit",
      description: "Create a new daily habit to track",
      color: "from-indigo-500 to-purple-500",
      onClick: () => setIsCreateModalOpen(true),
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Log Today",
      description: "Update today's progress",
      color: "from-emerald-500 to-teal-500",
      onClick: () => {}, // TODO: Implement quick log modal
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: "View Stats",
      description: "See your progress insights",
      color: "from-orange-500 to-red-500",
      onClick: () => {}, // TODO: Implement stats view
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      description: "Customize your experience",
      color: "from-blue-500 to-indigo-500",
      onClick: () => {}, // TODO: Implement settings
    },
  ];

  return (
    <>
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        
        <div className="space-y-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="w-full group relative p-4 bg-gradient-to-r hover:shadow-lg transition-all duration-200 rounded-2xl border border-gray-100 hover:border-transparent"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200`}>
                  {action.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-800">
                    {action.label}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Overview Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-lg p-8 text-white">
        <h2 className="text-xl font-bold mb-4">This Week</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm opacity-90">Habits Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">85%</div>
            <div className="text-sm opacity-90">Success Rate</div>
          </div>
        </div>
        <div className="mt-6 bg-white/20 rounded-xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Weekly Progress</span>
            <span>85%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2 transition-all duration-500" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>

      <CreateHabitModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
