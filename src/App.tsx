import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Goals } from './components/Goals';
import { ImportantSection } from './components/ImportantSection';
import { HabitTracker } from './components/HabitTracker';
import { DailyLog } from './components/DailyLog';
import { GratitudeSection } from './components/GratitudeSection';
import { InspirationCard } from './components/InspirationCard';
import { MorningJournal } from './components/MorningJournal';
import { EveningJournal } from './components/EveningJournal';
import { Settings } from './components/Settings';
import { useEntries } from './hooks/useEntries';
import { useLocalStorage } from './hooks/useLocalStorage';
import { storageManager } from './utils/storage';
import { getInspirationByDate } from './utils/inspirations';
import { AppSettings } from './types';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [settings, setSettings] = useLocalStorage<AppSettings>('app_settings', {
    theme: 'light',
    language: 'en',
    notifications: true
  });

  const { dailyEntries, carryOverEntries, loading, addEntry, updateEntry, deleteEntry, migrateTask } = useEntries(currentDate, storageReady);
  const inspiration = getInspirationByDate(currentDate);

  // Filter entries for different components
  const importantEntries = carryOverEntries.filter(entry => entry.type === 'important');
  const habitEntries = carryOverEntries.filter(entry => entry.type === 'habit');
  const actualGoals = carryOverEntries.filter(entry => entry.type === 'goal');

  useEffect(() => {
    // Initialize storage and PWA
    const initApp = async () => {
      try {
        await storageManager.init();
        setStorageReady(true);

        // Register service worker for PWA
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
              console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
              console.log('SW registration failed: ', registrationError);
            });
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initApp();
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const handleThemeToggle = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    setSettings({ ...settings, theme: newTheme });
  };

  const handleSettingsChange = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      await storageManager.saveSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:bg-gray-900 transition-colors">
      <Header
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onSettingsClick={() => setShowSettings(true)}
        theme={settings.theme}
        onThemeToggle={handleThemeToggle}
      />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Your Main Goals - Full Width */}
        <Goals
          goals={actualGoals}
          onUpdateGoal={updateEntry}
          onDeleteGoal={deleteEntry}
        />

        {/* Your Morning Plan - Side-by-Side */}
        <div className="grid gap-6 lg:grid-cols-2">
          <MorningJournal
            entries={dailyEntries}
            onAddEntry={addEntry}
            onUpdateEntry={updateEntry}
            onDeleteEntry={deleteEntry}
          />

          <InspirationCard inspiration={inspiration} />
        </div>

        {/* Your Daily Priorities - Side-by-Side */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ImportantSection
            importantEntries={importantEntries}
            onUpdateEntry={updateEntry}
            onDeleteEntry={deleteEntry}
          />

          <HabitTracker
            habitEntries={habitEntries}
            onUpdateEntry={updateEntry}
            onDeleteEntry={deleteEntry}
          />
        </div>

        {/* Your Full Daily Task List - Full Width */}
        <DailyLog
          dailyEntries={dailyEntries}
          onAddEntry={addEntry}
          onUpdateEntry={updateEntry}
          onDeleteEntry={deleteEntry}
          onMigrateTask={migrateTask}
        />

        {/* Your Evening Wind-Down - Side-by-Side */}
        <div className="grid gap-6 lg:grid-cols-2">
          <GratitudeSection
            entries={dailyEntries}
            onAddEntry={addEntry}
            onUpdateEntry={updateEntry}
            onDeleteEntry={deleteEntry}
          />

          <EveningJournal
            entries={dailyEntries}
            onAddEntry={addEntry}
            onUpdateEntry={updateEntry}
            onDeleteEntry={deleteEntry}
          />
        </div>
      </main>

      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}

export default App;