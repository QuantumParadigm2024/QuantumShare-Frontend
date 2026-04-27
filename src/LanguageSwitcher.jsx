import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';

const LanguageSwitcher = () => {
  const { t } = useTranslation();

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <div>
      <select value={i18n.language} onChange={handleLanguageChange}>
        <option value="en"> English</option>
        <option value="kn">ಕನ್ನಡ</option>
        <option value="hi">हिंदी</option>
        <option value="ta">தமிழ்</option>
        <option value="te">తెలుగు</option>
        <option value="ar">عربي</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
