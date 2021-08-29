import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  activeTheme: string;
  nextTheme: string;
  userThemes = {
    'light-theme': {
      name: 'Light Theme'
    },
    'dark-theme': {
      name: 'Dark Theme'
    }
  };

  themeSubject$: ReplaySubject<UserPreferences> = new ReplaySubject<UserPreferences>();
  userPrefs$ = this.themeSubject$.asObservable();

  constructor() { }

  setActiveTheme(changedTheme: string) {
    for (const [index, iterator] of Object.entries(this.userThemes)) {
      if (changedTheme === index) {
        this.activeTheme = iterator.name;
      } else {
        this.nextTheme = iterator.name;
      }
    }
  }
}

export interface UserPreferences {
  theme: string | null;
}

export interface UserThemes {
  [theme: string]: string;
}
