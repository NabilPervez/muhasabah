import React from 'react';
import { Star, Check, X } from 'lucide-react';
import { JournalEntry } from '../types';

interface GoalsProps {
  goals: JournalEntry[];
  onUpdateGoal: (id: string, updates: Partial<JournalEntry>) => void;
  onDeleteGoal: (id: string) => void;
}

export function Goals({ goals, onUpdateGoal, onDeleteGoal }: GoalsProps) {
  const toggleGoalComplete = (goal: JournalEntry) => {
    const newStatus = goal.status === 'complete' ? 'incomplete' : 'complete';
    onUpdateGoal(goal.id, { status: newStatus });
  };

  if (goals.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl shadow-sm border border-amber-200 dark:border-amber-800 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border-b border-amber-200 dark:border-amber-700">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Goals Checklist</h2>
        </div>
        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
          Long-term goals that carry over until completed
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-2">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                goal.status === 'complete'
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                  : 'bg-white dark:bg-gray-700 border-amber-200 dark:border-amber-600'
              }`}
            >
              <button
                onClick={() => toggleGoalComplete(goal)}
                className="mt-0.5 hover:scale-110 transition-transform"
              >
                {goal.status === 'complete' ? (
                  <Check className="w-4 h-4 text-amber-600" />
                ) : (
                  <Star className="w-4 h-4 text-amber-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`text-sm ${
                  goal.status === 'complete'
                    ? 'text-gray-500 dark:text-gray-400 line-through'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {goal.content}
                </p>
              </div>

              <button
                onClick={() => onDeleteGoal(goal.id)}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-500"
                title="Delete goal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}