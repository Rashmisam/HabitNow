import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useHabits } from "@/react-app/hooks/useHabits";
import { HABIT_CATEGORIES, CreateHabit } from "@/shared/types";

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateHabitModal({ isOpen, onClose }: CreateHabitModalProps) {
  const { createHabit } = useHabits();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateHabit>({
    name: '',
    category: 'exercise',
    description: '',
    target_frequency: 'daily',
    target_amount: 1,
    target_unit: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createHabit(formData);
      onClose();
      setFormData({
        name: '',
        category: 'exercise',
        description: '',
        target_frequency: 'daily',
        target_amount: 1,
        target_unit: '',
      });
    } catch (error) {
      console.error('Failed to create habit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateHabit, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Create New Habit</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Habit Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Habit Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Morning Run, Read 30 minutes"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {HABIT_CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleChange('category', category.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.category === category.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center text-white mb-2 mx-auto`}>
                    {category.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {category.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Target */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Target Amount *
              </label>
              <input
                type="number"
                min="1"
                value={formData.target_amount}
                onChange={(e) => handleChange('target_amount', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Unit *
              </label>
              <input
                type="text"
                value={formData.target_unit}
                onChange={(e) => handleChange('target_unit', e.target.value)}
                placeholder="minutes, times, pages"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Daily Focus Message */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-900">Daily Tracking</p>
                <p className="text-xs text-indigo-700">This habit will be tracked daily to help you build consistency</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Add any notes or motivation for this habit..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Create Habit
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
