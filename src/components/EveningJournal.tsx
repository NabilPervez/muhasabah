import React, { useState, useEffect } from 'react';
import { Moon, Plus } from 'lucide-react';
import { JournalEntry } from '../types';

interface EveningJournalProps {
  entries: JournalEntry[];
  onAddEntry: (content: string, type: JournalEntry['type']) => void;
  onUpdateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  onDeleteEntry: (id: string) => void;
}

export function EveningJournal({ entries, onAddEntry, onUpdateEntry, onDeleteEntry }: EveningJournalProps) {
  const [journalText, setJournalText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const eveningEntries = entries.filter(entry => entry.type === 'eveningJournal');

  useEffect(() => {
    if (eveningEntries.length > 0 && journalText === '') {
      setJournalText(eveningEntries[0].content);
    }
  }, [eveningEntries, journalText]);

  const handleSubmit = () => {
    if (journalText.trim()) {
      if (eveningEntries.length > 0) {
        const existingEntry = eveningEntries[0];
        onUpdateEntry(existingEntry.id, { content: journalText.trim() });
      } else {
        onAddEntry(journalText.trim(), 'eveningJournal');
      }
      setIsExpanded(false);
    }
  };

  const hasEntry = eveningEntries.length > 0;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-indigo-900/10 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-800 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-50/50 to-transparent dark:from-indigo-900/30 dark:to-transparent border-b border-indigo-100 dark:border-indigo-700">
        <div className="flex items-center space-x-2">
          <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Evening Journal</h2>
        </div>
        <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
          What's on your mind? What did you learn today?
        </p>
      </div>

      <div className="p-6">
        {hasEntry && !isExpanded ? (
          <div className="space-y-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
              <p className="text-gray-900 dark:text-white leading-relaxed">
                {eveningEntries[0].content}
              </p>
            </div>
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
            >
              Edit evening journal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="What's on your mind? What did you learn today?"
              className="w-full h-32 px-4 py-3 border border-purple-300 dark:border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />

            <div className="flex justify-between items-center">
              <div className="text-xs text-purple-600 dark:text-purple-400">
                <p>Reflect on your day's learnings</p>
              </div>

              <div className="flex space-x-2">
                {isExpanded && hasEntry && (
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      setJournalText(eveningEntries[0].content);
                    }}
                    className="px-4 py-2 text-sm border border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!journalText.trim()}
                  className="flex items-center space-x-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
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