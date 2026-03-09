import { defineStore } from 'pinia';

export interface LanguageState {
  language: string;
}

export const useLanguageStore = defineStore('language', {
  state: (): LanguageState => ({
    language: localStorage.getItem('language') || 'en'
  }),
  actions: {
    setLanguage(lang: string) {
      this.language = lang;
      localStorage.setItem('language', lang);
    }
  }
});