import React, { useState, useEffect } from 'react';
import { Sunrise, Plus } from 'lucide-react';
import { JournalEntry } from '../types';

interface MorningJournalProps {
  entries: JournalEntry[];
  onAddEntry: (content: string, type: JournalEntry['type']) => void;
  onUpdateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  onDeleteEntry: (id: string) => void;
}

export function MorningJournal({ entries, onAddEntry, onUpdateEntry, onDeleteEntry }: MorningJournalProps) {
  const [journalText, setJournalText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const morningEntries = entries.filter(entry => entry.type === 'morningJournal');

  useEffect(() => {
    if (morningEntries.length > 0) {
      setJournalText(morningEntries[0].content);
    } else {
      setJournalText('');
    }
  }, [morningEntries]);

  const handleSubmit = () => {
    if (journalText.trim()) {
      if (morningEntries.length > 0) {
        const existingEntry = morningEntries[0];
        onUpdateEntry(existingEntry.id, { content: journalText.trim() });
      } else {
        onAddEntry(journalText.trim(), 'morningJournal');
      }
      setIsExpanded(false);
    }
  };

  const hasEntry = morningEntries.length > 0;

  return (
    <div className="bg-gradient-to-br from-sky-50 to-white dark:from-sky-900/20 dark:to-sky-900/10 rounded-xl shadow-sm border border-sky-100 dark:border-sky-800 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-sky-50/50 to-transparent dark:from-sky-900/30 dark:to-transparent border-b border-sky-100 dark:border-sky-700">
        <div className="flex items-center space-x-2">
          <Sunrise className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Morning Journal</h2>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
          What's on your mind? What is one win from yesterday?
        </p>
      </div>

      <div className="p-6">
        {hasEntry && !isExpanded ? (
          <div className="space-y-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
              <p className="text-gray-900 dark:text-white leading-relaxed">
                {morningEntries[0].content}
              </p>
            </div>
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Edit morning journal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="What's on your mind? What is one win from yesterday?"
              className="w-full h-32 px-4 py-3 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />

            <div className="flex justify-between items-center">
              <div className="text-xs text-blue-600 dark:text-blue-400">
                <p>Start your day with reflection</p>
              </div>

              <div className="flex space-x-2">
                {isExpanded && hasEntry && (
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      setJournalText(morningEntries[0].content);
                    }}
                    className="px-4 py-2 text-sm border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!journalText.trim()}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
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