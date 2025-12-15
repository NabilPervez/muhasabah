import React from 'react';
import { RotateCcw, Check, X } from 'lucide-react';
import { JournalEntry } from '../types';

interface HabitTrackerProps {
  habitEntries: JournalEntry[];
  onUpdateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  onDeleteEntry: (id: string) => void;
}

export function HabitTracker({ habitEntries, onUpdateEntry, onDeleteEntry }: HabitTrackerProps) {
  const toggleEntryComplete = (entry: JournalEntry) => {
    const newStatus = entry.status === 'complete' ? 'incomplete' : 'complete';
    onUpdateEntry(entry.id, { status: newStatus });
  };

  if (habitEntries.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-800 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-900/30 dark:to-transparent border-b border-emerald-100 dark:border-emerald-700">
        <div className="flex items-center space-x-2">
          <RotateCcw className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Habit Tracker</h2>
        </div>
        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
          Daily habits to build consistency
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-2">
          {habitEntries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${entry.status === 'complete'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-white dark:bg-gray-700 border-green-200 dark:border-green-600'
                }`}
            >
              <button
                onClick={() => toggleEntryComplete(entry)}
                className="mt-0.5 hover:scale-110 transition-transform"
              >
                {entry.status === 'complete' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <RotateCcw className="w-4 h-4 text-green-500" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`text-sm ${entry.status === 'complete'
                    ? 'text-gray-500 dark:text-gray-400 line-through'
                    : 'text-gray-900 dark:text-white'
                  }`}>
                  {entry.content}
                </p>
              </div>

              <button
                onClick={() => onDeleteEntry(entry.id)}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-500"
                title="Delete habit"
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