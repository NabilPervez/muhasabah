import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { JournalEntry } from '../types';
import { storageManager } from '../utils/storage';

export function useEntries(currentDate: Date, storageReady: boolean) {
  const [dailyEntries, setDailyEntries] = useState<JournalEntry[]>([]);
  const [carryOverEntries, setCarryOverEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const dateString = format(currentDate, 'yyyy-MM-dd');

  const loadAllData = useCallback(async () => {
    if (!storageReady) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const dateEntries = await storageManager.getEntriesByDate(dateString);
      const allGoals = await storageManager.getAllIncompleteGoals();
      const allImportant = await storageManager.getAllIncompleteImportant();
      const allHabits = await storageManager.getAllIncompleteHabits();
      
      // Get all incomplete daily log entries from all dates
      const allIncompleteEntries = await storageManager.getAllIncompleteEntriesByType(['task', 'note', 'event']);
      
      const todayString = format(new Date(), 'yyyy-MM-dd');
      const newCarriedOverEntries: JournalEntry[] = [];

      // Only migrate overdue entries if we are viewing the current actual day
      if (dateString === todayString) {
        // Find overdue entries (strictly from previous days)
        const overdueEntries = allIncompleteEntries.filter(entry => entry.date < todayString);
        
        // Create new entries for current date from overdue entries
        for (const overdueEntry of overdueEntries) {
          // Create new entry for current date
          const newCarriedOverEntry: JournalEntry = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            date: dateString,
            content: overdueEntry.content,
            type: overdueEntry.type,
            status: 'incomplete',
            createdAt: new Date(),
            originalDate: overdueEntry.date
          };
          
          // Save new entry
          await storageManager.saveEntry(newCarriedOverEntry);
          newCarriedOverEntries.push(newCarriedOverEntry);
          
          // Mark original entry as migrated
          await storageManager.saveEntry({
            ...overdueEntry,
            status: 'migrated',
            migratedTo: dateString
          });
        }
      }
      
      const allCarryOverEntries = [...allGoals, ...allImportant, ...allHabits];
      
      // Combine current day entries with carried over entries
      const combinedDailyEntries = [...dateEntries, ...newCarriedOverEntries];
      
      // Filter out migrated entries from daily view
      const activeDailyEntries = combinedDailyEntries.filter(entry => entry.status !== 'migrated');
      
      setDailyEntries(activeDailyEntries.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
      setCarryOverEntries(allCarryOverEntries.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  }, [dateString, storageReady]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const addEntry = async (content: string, type: JournalEntry['type']) => {
    const newEntry: JournalEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: (type === 'goal' || type === 'important' || type === 'habit') ? format(new Date(), 'yyyy-MM-dd') : dateString,
      content,
      type,
      status: 'incomplete',
      createdAt: new Date()
    };

    try {
      await storageManager.saveEntry(newEntry);
      if (type === 'goal' || type === 'important' || type === 'habit') {
        setCarryOverEntries(prev => [...prev, newEntry]);
      } else {
        setDailyEntries(prev => [...prev, newEntry]);
      }
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const updateEntry = async (id: string, updates: Partial<JournalEntry>) => {
    const dailyEntry = dailyEntries.find(e => e.id === id);
    const carryOverEntry = carryOverEntries.find(e => e.id === id);
    const entry = dailyEntry || carryOverEntry;
    
    if (!entry) return;

    const updatedEntry = { ...entry, ...updates };

    try {
      await storageManager.saveEntry(updatedEntry);
      
      if (entry.type === 'goal' || entry.type === 'important' || entry.type === 'habit') {
        if (updatedEntry.status === 'complete') {
          // Remove completed entry from carry-over list
          setCarryOverEntries(prev => prev.filter(e => e.id !== id));
        } else {
          setCarryOverEntries(prev => prev.map(e => e.id === id ? updatedEntry : e));
        }
      } else {
        setDailyEntries(prev => prev.map(e => e.id === id ? updatedEntry : e));
      }
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await storageManager.deleteEntry(id);
      setDailyEntries(prev => prev.filter(e => e.id !== id));
      setCarryOverEntries(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const migrateTask = async (id: string, targetDate: Date) => {
    const entry = dailyEntries.find(e => e.id === id);
    if (!entry || entry.type !== 'task') return;

    const targetDateString = format(targetDate, 'yyyy-MM-dd');
    
    // Mark original as migrated
    await updateEntry(id, { status: 'migrated', migratedTo: targetDateString });

    // Create new entry for target date
    const migratedEntry: JournalEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: targetDateString,
      content: entry.content,
      type: 'task',
      status: 'incomplete',
      createdAt: new Date(),
      migratedFrom: dateString
    };

    try {
      await storageManager.saveEntry(migratedEntry);
      
      // If migrating to current date, add to dailyEntries immediately
      if (targetDateString === dateString) {
        setDailyEntries(prev => [...prev, migratedEntry]);
      }
    } catch (error) {
      console.error('Error migrating task:', error);
    }
  };

  return {
    dailyEntries,
    carryOverEntries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    migrateTask,
    refreshEntries: loadAllData
  };
}