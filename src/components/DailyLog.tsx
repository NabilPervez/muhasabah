import React, { useState } from 'react';
import { Plus, Check, Square, Circle, ArrowRight, X, Calendar, Star, AlertTriangle, RotateCcw } from 'lucide-react';
import { JournalEntry } from '../types';

interface DailyLogProps {
  dailyEntries: JournalEntry[];
  onAddEntry: (content: string, type: JournalEntry['type']) => void;
  onUpdateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  onDeleteEntry: (id: string) => void;
  onMigrateTask: (id: string, targetDate: Date) => void;
}

export function DailyLog({ dailyEntries, onAddEntry, onUpdateEntry, onDeleteEntry, onMigrateTask }: DailyLogProps) {
  const [newEntry, setNewEntry] = useState('');
  const [selectedType, setSelectedType] = useState<JournalEntry['type']>('task');
  const [migrationId, setMigrationId] = useState<string | null>(null);
  const [migrationDate, setMigrationDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntry.trim()) {
      onAddEntry(newEntry.trim(), selectedType);
      setNewEntry('');
    }
  };

  const toggleTaskComplete = (entry: JournalEntry) => {
    const newStatus = entry.status === 'complete' ? 'incomplete' : 'complete';
    onUpdateEntry(entry.id, { status: newStatus });
  };

  const handleMigration = (e: React.FormEvent) => {
    e.preventDefault();
    if (migrationId && migrationDate) {
      onMigrateTask(migrationId, new Date(migrationDate));
      setMigrationId(null);
      setMigrationDate('');
    }
  };

  const getEntryIcon = (entry: JournalEntry) => {
    switch (entry.type) {
      case 'task':
        if (entry.status === 'complete') {
          return <Check className="w-4 h-4 text-emerald-600" />;
        }
        if (entry.status === 'migrated') {
          return <ArrowRight className="w-4 h-4 text-amber-600" />;
        }
        return <Square className="w-4 h-4 text-gray-400" />;
      case 'goal':
        if (entry.status === 'complete') {
          return <Check className="w-4 h-4 text-amber-600" />;
        }
        return <Star className="w-4 h-4 text-amber-400" />;
      case 'important':
        if (entry.status === 'complete') {
          return <Check className="w-4 h-4 text-red-600" />;
        }
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'habit':
        if (entry.status === 'complete') {
          return <Check className="w-4 h-4 text-green-600" />;
        }
        return <RotateCcw className="w-4 h-4 text-green-500" />;
      case 'event':
        return <Circle className="w-4 h-4 text-blue-600" />;
      case 'note':
        return <div className="w-4 h-4 flex items-center justify-center">
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        </div>;
      default:
        return null;
    }
  };

  const filteredEntries = dailyEntries.filter(entry => 
    entry.type !== 'gratitude' && 
    entry.type !== 'goal' && 
    entry.type !== 'important' && 
    entry.type !== 'habit' &&
    entry.type !== 'morningJournal' &&
    entry.type !== 'eveningJournal'
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Log</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Track your tasks, events, and notes</p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              { type: 'goal' as const, label: 'Goal', icon: Star },
              { type: 'task' as const, label: 'Task', icon: Square },
              { type: 'important' as const, label: 'Important', icon: AlertTriangle },
              { type: 'habit' as const, label: 'Habit', icon: RotateCcw },
              { type: 'event' as const, label: 'Event', icon: Circle },
              { type: 'note' as const, label: 'Note', icon: Circle }
            ].map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder={`Add a new ${selectedType}...`}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              disabled={!newEntry.trim()}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </form>

        <div className="space-y-2">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No entries yet. Start by adding a task, event, or note above.</p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                  entry.originalDate
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : entry.status === 'complete'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                    : entry.status === 'migrated'
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <button
                  onClick={() => toggleTaskComplete(entry)}
                  className="mt-0.5 hover:scale-110 transition-transform"
                  disabled={entry.status === 'migrated'}
                >
                  {getEntryIcon(entry)}
                </button>

                <div className="flex-1 min-w-0">
                  {entry.originalDate && (
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-full mb-2">
                      OVERDUE
                    </span>
                  )}
                  <p className={`text-sm ${
                    entry.status === 'complete'
                      ? 'text-gray-500 dark:text-gray-400 line-through'
                      : entry.status === 'migrated'
                      ? 'text-amber-700 dark:text-amber-300'
                      : entry.originalDate
                      ? 'text-red-900 dark:text-red-100'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {entry.content}
                  </p>
                  {entry.originalDate && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Originally from {entry.originalDate}
                    </p>
                  )}
                  {entry.migratedFrom && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      Migrated from {entry.migratedFrom}
                    </p>
                  )}
                  {entry.migratedTo && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      Migrated to {entry.migratedTo}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  {entry.type === 'task' && entry.status === 'incomplete' && (
                    <button
                      onClick={() => setMigrationId(entry.id)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-500 dark:text-gray-400"
                      title="Migrate task"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-500"
                    title="Delete entry"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {migrationId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Migrate Task
              </h3>
              <form onSubmit={handleMigration}>
                <input
                  type="date"
                  value={migrationDate}
                  onChange={(e) => setMigrationDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white mb-4"
                  required
                />
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMigrationId(null);
                      setMigrationDate('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Migrate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}