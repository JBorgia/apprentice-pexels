import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  userThemes = {
    'light-theme': {
      name: 'Light Theme',
      active: false,
    },
    'dark-theme': {
      name: 'Dark Theme',
      active: false,
    }
  };

  themeSubject$: ReplaySubject<UserPreferences> = new ReplaySubject<UserPreferences>();
  userPrefs$ = this.themeSubject$.asObservable();

  constructor() { }

  setActiveTheme(setTheme: string) {
    for (const [index, iterator] of Object.entries(this.userThemes)) {
      if (setTheme === index) {
        iterator.active = true;
      } else {
        iterator.active = false;
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
