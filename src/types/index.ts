export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  type: 'task' | 'note' | 'event' | 'gratitude' | 'goal' | 'important' | 'habit' | 'morningJournal' | 'eveningJournal';
  status: 'incomplete' | 'complete' | 'migrated';
  createdAt: Date;
  migratedFrom?: string;
  migratedTo?: string;
  originalDate?: string;
}

export interface InspirationContent {
  id: string;
  type: 'quran' | 'hadith' | 'quote';
  content: string;
  source: string;
  translation?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'en' | 'ar';
  notifications: boolean;
}