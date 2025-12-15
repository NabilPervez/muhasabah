import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { JournalEntry } from '../types';

interface ImportantSectionProps {
  importantEntries: JournalEntry[];
  onUpdateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  onDeleteEntry: (id: string) => void;
}

export function ImportantSection({ importantEntries, onUpdateEntry, onDeleteEntry }: ImportantSectionProps) {
  const toggleEntryComplete = (entry: JournalEntry) => {
    const newStatus = entry.status === 'complete' ? 'incomplete' : 'complete';
    onUpdateEntry(entry.id, { status: newStatus });
  };

  if (importantEntries.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-red-900/10 rounded-xl shadow-sm border border-red-100 dark:border-red-800 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-red-50/50 to-transparent dark:from-red-900/30 dark:to-transparent border-b border-red-100 dark:border-red-700">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Important Tasks</h2>
        </div>
        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
          High priority items that need attention
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-2">
          {importantEntries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${entry.status === 'complete'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : 'bg-white dark:bg-gray-700 border-red-200 dark:border-red-600'
                }`}
            >
              <button
                onClick={() => toggleEntryComplete(entry)}
                className="mt-0.5 hover:scale-110 transition-transform"
              >
                {entry.status === 'complete' ? (
                  <Check className="w-4 h-4 text-red-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
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
                title="Delete important task"
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