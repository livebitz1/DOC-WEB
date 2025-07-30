// i18n.ts
"use client";
// Centralized translation utility for English and Khmer


import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from "react";

export type Language = "en" | "km";

export const translations = {
  en: {
    doctorDashboard: "Doctor Dashboard",
    learnMore: "Learn More",
    available: "Available",
    whyChooseUs: "WHY CHOOSE US",
    excellenceIn: "Excellence in",
    dentalCare: "Dental Care",
    // ...add more keys as needed
  },
  km: {
    doctorDashboard: "ផ្ទាំងវេជ្ជបណ្ឌិត",
    learnMore: "ស្វែងយល់បន្ថែម",
    available: "មានសេវា",
    whyChooseUs: "ហេតុអ្វីជ្រើសរើសយើង",
    excellenceIn: "ភាពល្អឆ្នើមក្នុង",
    dentalCare: "ការថែទាំធ្មេញ",
    // ...add more keys as needed
  },
};

export function t(key: keyof typeof translations["en"], language: Language): string {
  return translations[language][key] || translations.en[key] || key;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

export const LanguageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const lang = localStorage.getItem("lang");
      return lang === "km" ? "km" : "en";
    }
    return "en";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", language);
    }
  }, [language]);

  return React.createElement(LanguageContext.Provider, { value: { language, setLanguage } }, children);
};
