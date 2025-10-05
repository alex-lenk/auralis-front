import { makeAutoObservable } from 'mobx';
import i18n from 'i18next';

import { RootStore } from '@/stores/RootStore';
import { language, languageName } from '@/shared/enum/language';

class LanguageStore {
  language = i18n.language;
  isOpen = false;

  languages = [
    { code: language.Ru, label: languageName.Ru },
    { code: language.En, label: languageName.En },
  ];

  constructor(protected rootStore: RootStore) {
    makeAutoObservable(this);

    this.language = this.getNormalizedLanguage(i18n.language);
  }

  setLanguage(lang: string) {
    i18n.changeLanguage(lang);
    this.language = lang;
    this.isOpen = false;
    document.documentElement.lang = lang;
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  getNormalizedLanguage(lang: string) {
    return this.languages.find(l => l.code === lang)?.code || language.Ru;
  }
}

export default LanguageStore;
