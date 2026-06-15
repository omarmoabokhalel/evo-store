import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LanguageState {
  language: "ar" | "en";
  setLanguage: (lang: "ar" | "en") => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "ar", // Default language is Arabic (اللغة الأساسية عربي)
      setLanguage: (lang) => set({ language: lang }),
    }),
    { name: "evo-language" }
  )
);
