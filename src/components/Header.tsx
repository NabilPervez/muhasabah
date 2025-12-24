import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface HeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onSettingsClick: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function Header({ currentDate, onDateChange }: HeaderProps) {
  const goToPreviousDay = () => {
    const previousDay = new Date(currentDate);
    previousDay.setDate(previousDay.getDate() - 1);
    onDateChange(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    onDateChange(nextDay);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 py-3 shadow-sm">
      <div className="grid grid-cols-3 items-center max-w-4xl mx-auto">
        {/* Branding - Left */}
        <div className="flex items-center justify-start">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent hidden sm:block">
            Baraka Boost
          </span>
        </div>


        {/* Date Selector - Center */}
        <div className="flex items-center justify-center space-x-2 w-full">
          <button
            onClick={goToPreviousDay}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center min-w-[140px] cursor-pointer" onClick={goToToday} role="button" title="Go to Today">
            <h1 className="text-base font-bold text-gray-800 leading-tight">
              {format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                ? 'Today'
                : format(currentDate, 'EEE, MMM d')}
            </h1>
            <p className="text-xs text-blue-500 font-medium">
              {format(currentDate, 'MMMM d, yyyy')}
            </p>
          </div>

          <button
            onClick={goToNextDay}
            disabled={isToday}
            className={`p-1.5 rounded-full transition-colors ${isToday ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-500'}`}
            aria-label="Next day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right Side - Empty for now as per request (removed settings/nightmode) */}
        <div className="flex items-center justify-end">
          {/* Placeholder or other actions could go here */}
          {!isToday && (
            <button
              onClick={goToToday}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              aria-label="Go to today"
            >
              <Calendar className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header >
  );
}