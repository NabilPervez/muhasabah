import React from 'react';
import { X, Moon, Sun, Globe, Bell } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export function Settings({ isOpen, onClose, settings, onSettingsChange }: SettingsProps) {
  if (!isOpen) return null;

  const handleThemeChange = (theme: 'light' | 'dark') => {
    onSettingsChange({ ...settings, theme });
  };

  const handleLanguageChange = (language: 'en' | 'ar') => {
    onSettingsChange({ ...settings, language });
  };

  const handleNotificationsChange = (notifications: boolean) => {
    onSettingsChange({ ...settings, notifications });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Setting */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
              <Moon className="w-4 h-4 inline mr-2" />
              Theme
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
                  settings.theme === 'light'
                    ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
                  settings.theme === 'dark'
                    ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Language Setting */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
              <Globe className="w-4 h-4 inline mr-2" />
              Language
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                  settings.language === 'en'
                    ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('ar')}
                className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                  settings.language === 'ar'
                    ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                العربية
              </button>
            </div>
          </div>

          {/* Notifications Setting */}
          <div>
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                <Bell className="w-4 h-4 inline mr-2" />
                Daily Reminders
              </span>
              <button
                onClick={() => handleNotificationsChange(!settings.notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications
                    ? 'bg-emerald-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Get reminded to write in your journal
            </p>
          </div>

          {/* About Section */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              About Digital Islamic Bullet Journal
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              A secure, offline-first journaling app that combines the bullet journal method 
              with Islamic spiritual reflection. Your data is encrypted and stored locally 
              on your device for complete privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}