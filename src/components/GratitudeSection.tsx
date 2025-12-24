import React, { useState, useEffect } from 'react';
import { Heart, Plus } from 'lucide-react';
import { JournalEntry } from '../types';

interface GratitudeSectionProps {
  entries: JournalEntry[];
  onAddEntry: (content: string, type: JournalEntry['type']) => void;
  onUpdateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  onDeleteEntry: (id: string) => void;
}

export function GratitudeSection({ entries, onAddEntry, onUpdateEntry, onDeleteEntry }: GratitudeSectionProps) {
  const [gratitudeText, setGratitudeText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const gratitudeEntries = entries.filter(entry => entry.type === 'gratitude');

  useEffect(() => {
    if (gratitudeEntries.length > 0) {
      setGratitudeText(gratitudeEntries[0].content);
    } else {
      setGratitudeText('');
    }
  }, [gratitudeEntries]);

  const handleSubmit = () => {
    if (gratitudeText.trim()) {
      if (gratitudeEntries.length > 0) {
        const existingEntry = gratitudeEntries[0];
        onUpdateEntry(existingEntry.id, { content: gratitudeText.trim() });
      } else {
        onAddEntry(gratitudeText.trim(), 'gratitude');
      }
      setIsExpanded(false);
    }
  };

  const hasGratitude = gratitudeEntries.length > 0;


  return (
    <div className="bg-gradient-to-br from-rose-50 to-white dark:from-rose-900/20 dark:to-rose-900/10 rounded-xl shadow-sm border border-rose-100 dark:border-rose-800 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-rose-50/50 to-transparent dark:from-rose-900/30 dark:to-transparent border-b border-rose-100 dark:border-rose-700">
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Gratitude Reflection</h2>
        </div>
        <p className="text-sm text-pink-700 dark:text-pink-300 mt-1">
          What are you grateful for today?
        </p>
      </div>

      <div className="p-6">
        {hasGratitude && !isExpanded ? (
          <div className="space-y-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-pink-200 dark:border-pink-700">
              <p className="text-gray-900 dark:text-white leading-relaxed">
                {gratitudeEntries[0].content}
              </p>
            </div>
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium"
            >
              Edit gratitude reflection
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={gratitudeText}
              onChange={(e) => setGratitudeText(e.target.value)}
              placeholder="I am grateful for..."
              className="w-full h-32 px-4 py-3 border border-pink-300 dark:border-pink-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />

            <div className="flex justify-between items-center">
              <div className="text-xs text-pink-600 dark:text-pink-400">
                <p>Reflect on the blessings in your life</p>
              </div>

              <div className="flex space-x-2">
                {isExpanded && hasGratitude && (
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      setGratitudeText(gratitudeEntries[0].content);
                    }}
                    className="px-4 py-2 text-sm border border-pink-300 dark:border-pink-600 text-pink-700 dark:text-pink-300 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!gratitudeText.trim()}
                  className="flex items-center space-x-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}