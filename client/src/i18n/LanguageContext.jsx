import React, { createContext, useContext, useState, useEffect } from 'react';
import en from './en';
import vi from './vi';

const translations = { en, vi };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const translationObj = translations[language] || translations.en;

  // Tạo hàm hỗ trợ tra cứu theo key phân cách bằng dấu chấm: t("admin.dashboard")
  // Đồng thời sao chép tất cả thuộc tính cấp cao nhất để ký hiệu chấm vẫn hoạt động: t.nav.admin
  const t = (key) => {
    if (typeof key !== 'string') return key;
    return key.split('.').reduce((obj, k) => obj?.[k], translationObj) ?? key;
  };
  Object.assign(t, translationObj);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
