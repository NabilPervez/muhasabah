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
  console.log('[DEBUG] App: render start');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [settings, setSettings] = useLocalStorage<AppSettings>('app_settings', {
    theme: 'light',
    language: 'en',
    notifications: true
  });



  console.log('[DEBUG] App: calling useEntries', { currentDate, storageReady });
  const { dailyEntries, carryOverEntries, loading, addEntry, updateEntry, deleteEntry, migrateTask } = useEntries(currentDate, storageReady);
  console.log('[DEBUG] App: useEntries returned', { dailyEntriesCount: dailyEntries.length, loading });
  const inspiration = getInspirationByDate(currentDate);

  // Filter entries for different components
  const importantEntries = carryOverEntries.filter(entry => entry.type === 'important');
  const habitEntries = carryOverEntries.filter(entry => entry.type === 'habit');
  const actualGoals = carryOverEntries.filter(entry => entry.type === 'goal');

  useEffect(() => {
    console.log('[DEBUG] App: init effect running');
    // Initialize storage and PWA
    const initApp = async () => {
      try {
        console.log('[DEBUG] App: calling storageManager.init()');
        await storageManager.init();
        console.log('[DEBUG] App: storageManager.init() complete, setting storageReady=true');
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
        console.error('[DEBUG] Failed to initialize app:', error);
        console.error('Failed to initialize app:', error);
      }
    };

    initApp();
  }, []);

  useEffect(() => {
    // Force light mode theme class removal
    document.documentElement.classList.remove('dark');
  }, []);

  const handleSettingsChange = async (newSettings: AppSettings) => {
    // Ensure theme stays light
    const fixedSettings = { ...newSettings, theme: 'light' as const };
    setSettings(fixedSettings);
    try {
      await storageManager.saveSettings(fixedSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };



  return (
    <div className="min-h-screen bg-slate-50 transition-colors pb-12">
      {console.log('[DEBUG] App: rendering JSX')}
      <Header
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onSettingsClick={() => setShowSettings(true)}
        theme={'light'}
        onThemeToggle={() => { }}
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