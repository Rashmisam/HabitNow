import { useHabits } from "@/react-app/hooks/useHabits";
import { HABIT_CATEGORIES } from "@/shared/types";
import { BarChart3, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import CreateHabitModal from "./CreateHabitModal";

export default function HabitOverview() {
  const { habits, isLoading } = useHabits();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const habitsByCategory = HABIT_CATEGORIES.map(category => ({
    ...category,
    habits: habits.filter(habit => habit.category === category.value),
    count: habits.filter(habit => habit.category === category.value).length,
  }));

  return (
    <>
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-indigo-600" />
            Your Daily Habits
          </h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Habit
          </button>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Start building better daily habits today!</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Daily Habit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {habitsByCategory.map(category => (
              <CategoryCard key={category.value} category={category} />
            ))}
          </div>
        )}
      </div>

      <CreateHabitModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}

function CategoryCard({ category }: { category: any }) {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl ${category.color} flex items-center justify-center text-white text-lg`}>
            {category.icon}
          </div>
          <h3 className="font-semibold text-gray-900">{category.label}</h3>
        </div>
        <span className="text-2xl font-bold text-gray-600">{category.count}</span>
      </div>
      
      {category.habits.length > 0 ? (
        <div className="space-y-2">
          {category.habits.slice(0, 3).map((habit: any) => (
            <div key={habit.id} className="text-sm text-gray-600 bg-white p-2 rounded-lg">
              {habit.name}
            </div>
          ))}
          {category.habits.length > 3 && (
            <div className="text-xs text-gray-500 text-center pt-2">
              +{category.habits.length - 3} more
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No habits in this category yet</p>
      )}
    </div>
  );
}
