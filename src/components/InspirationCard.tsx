import React from 'react';
import { BookOpen, Star } from 'lucide-react';
import { InspirationContent } from '../types';

interface InspirationCardProps {
  inspiration: InspirationContent;
}

export function InspirationCard({ inspiration }: InspirationCardProps) {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl shadow-sm border border-emerald-200 dark:border-emerald-800 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border-b border-emerald-200 dark:border-emerald-700">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Inspiration</h2>
        </div>
        <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
          Spiritual guidance for your day
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {inspiration.type === 'quran' && inspiration.content.includes('وَ') ? (
            <div className="text-center">
              <p className="text-xl text-gray-900 dark:text-white font-amiri leading-relaxed mb-3" dir="rtl">
                {inspiration.content}
              </p>
              {inspiration.translation && (
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                  "{inspiration.translation}"
                </p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg text-gray-900 dark:text-white leading-relaxed mb-3">
                "{inspiration.content}"
              </p>
            </div>
          )}

          <div className="flex items-center justify-center space-x-2 pt-4 border-t border-emerald-200 dark:border-emerald-700">
            <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              {inspiration.source}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}