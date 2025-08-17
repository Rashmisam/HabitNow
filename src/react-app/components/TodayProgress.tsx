import { useHabits } from "@/react-app/hooks/useHabits";
import { HABIT_CATEGORIES } from "@/shared/types";
import { Calendar, CheckCircle2, Target } from "lucide-react";

export default function TodayProgress() {
  const { habits, isLoading } = useHabits();

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const dailyHabits = habits; // All habits are daily now
  const completedToday = 0; // We'll implement this when we have entries

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Calendar className="w-6 h-6 mr-3 text-indigo-600" />
          Today's Progress
        </h2>
        <div className="flex items-center space-x-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-gray-600">
            {completedToday} of {dailyHabits.length} completed
          </span>
        </div>
      </div>

      {dailyHabits.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No daily habits yet. Create your first daily habit to start tracking!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {dailyHabits.map(habit => {
            const category = HABIT_CATEGORIES.find(cat => cat.value === habit.category);
            return (
              <HabitProgressCard key={habit.id} habit={habit} category={category} />
            );
          })}
        </div>
      )}
    </div>
  );
}

function HabitProgressCard({ 
  habit, 
  category 
}: { 
  habit: any;
  category: any;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-xl ${category?.color || 'bg-gray-500'} flex items-center justify-center text-white text-lg`}>
          {category?.icon || '📝'}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{habit.name}</h3>
          <p className="text-sm text-gray-600">
            Target: {habit.target_amount} {habit.target_unit}
          </p>
        </div>
      </div>
      
      <button className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 transition-colors flex items-center justify-center">
        <CheckCircle2 className="w-5 h-5 text-gray-400 hover:text-emerald-500" />
      </button>
    </div>
  );
}
