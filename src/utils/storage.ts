import CryptoJS from 'crypto-js';
import { JournalEntry, AppSettings } from '../types';

const DB_NAME = 'IslamicBujoDB';
const DB_VERSION = 4;
const ENTRIES_STORE = 'entries';
const SETTINGS_STORE = 'settings';
const ENCRYPTION_KEY = 'islamic-bujo-secure-key-2024';

class StorageManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(ENTRIES_STORE)) {
          const entriesStore = db.createObjectStore(ENTRIES_STORE, { keyPath: 'id' });
          entriesStore.createIndex('date', 'date', { unique: false });
          entriesStore.createIndex('type', 'type', { unique: false });
          entriesStore.createIndex('status', 'status', { unique: false });
          entriesStore.createIndex('type_status', ['type', 'status'], { unique: false });
        } else if (event.oldVersion < 2) {
          // Add new indexes for version 2
          const transaction = (event.target as IDBOpenDBRequest).transaction!;
          const entriesStore = transaction.objectStore(ENTRIES_STORE);
          if (!entriesStore.indexNames.contains('status')) {
            entriesStore.createIndex('status', 'status', { unique: false });
          }
          if (!entriesStore.indexNames.contains('type_status')) {
            entriesStore.createIndex('type_status', ['type', 'status'], { unique: false });
          }
        }

        if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
          db.createObjectStore(SETTINGS_STORE, { keyPath: 'key' });
        }
      };
    });
  }

  private encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  }

  private decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  async saveEntry(entry: JournalEntry): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const encryptedEntry = {
      ...entry,
      content: this.encrypt(entry.content)
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([ENTRIES_STORE], 'readwrite');
      const store = transaction.objectStore(ENTRIES_STORE);
      const request = store.put(encryptedEntry);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getEntriesByDate(date: string): Promise<JournalEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([ENTRIES_STORE], 'readonly');
      const store = transaction.objectStore(ENTRIES_STORE);
      const index = store.index('date');
      const request = index.getAll(date);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const entries = request.result.map(entry => ({
          ...entry,
          content: this.decrypt(entry.content)
        }));
        resolve(entries);
      };
    });
  }

  async getAllIncompleteGoals(): Promise<JournalEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([ENTRIES_STORE], 'readonly');
      const store = transaction.objectStore(ENTRIES_STORE);
      const index = store.index('type_status');
      const request = index.getAll(['goal', 'incomplete']);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const entries = request.result.map(entry => ({
          ...entry,
          content: this.decrypt(entry.content)
        }));
        resolve(entries);
      };
    });
  }

  async getAllIncompleteImportant(): Promise<JournalEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([ENTRIES_STORE], 'readonly');
      const store = transaction.objectStore(ENTRIES_STORE);
      const index = store.index('type_status');
      const request = index.getAll(['important', 'incomplete']);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const entries = request.result.map(entry => ({
          ...entry,
          content: this.decrypt(entry.content)
        }));
        resolve(entries);
      };
    });
  }

  async getAllIncompleteHabits(): Promise<JournalEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([ENTRIES_STORE], 'readonly');
      const store = transaction.objectStore(ENTRIES_STORE);
      const index = store.index('type_status');
      const request = index.getAll(['habit', 'incomplete']);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const entries = request.result.map(entry => ({
          ...entry,
          content: this.decrypt(entry.content)
        }));
        resolve(entries);
      };
    });
  }

  async getAllIncompleteEntriesByType(types: string[]): Promise<JournalEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([ENTRIES_STORE], 'readonly');
      const store = transaction.objectStore(ENTRIES_STORE);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const allEntries = request.result;
        const filteredEntries = allEntries.filter(entry => 
          types.includes(entry.type) && entry.status === 'incomplete'
        );
        const decryptedEntries = filteredEntries.map(entry => ({
          ...entry,
          content: this.decrypt(entry.content)
        }));
        resolve(decryptedEntries);
      };
    });
  }

  async deleteEntry(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([ENTRIES_STORE], 'readwrite');
      const store = transaction.objectStore(ENTRIES_STORE);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SETTINGS_STORE], 'readwrite');
      const store = transaction.objectStore(SETTINGS_STORE);
      const request = store.put({ key: 'app_settings', value: settings });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getSettings(): Promise<AppSettings> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SETTINGS_STORE], 'readonly');
      const store = transaction.objectStore(SETTINGS_STORE);
      const request = store.get('app_settings');

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : {
          theme: 'light',
          language: 'en',
          notifications: true
        });
      };
    });
  }
}

export const storageManager = new StorageManager();