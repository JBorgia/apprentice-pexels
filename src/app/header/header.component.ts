import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Util } from '../util/util';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('fHeader') mainHeader: ElementRef;

  resizingId = false;
  scrollingId = false;
  previousTop = 0;
  currentTop = 0;
  scrollDelta = 10;
  scrollOffset = 150;

  registerForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      search: ['', Validators.required],
    });
    this.windowScroll();
  }

  get userPrefs() {
    return this.themeService.userPrefs$;
  }

  get f() {
    return this.registerForm.controls;
  }

  handleThemeChange(selectedTheme: string | null) {
    if (selectedTheme) {
      let theme = (selectedTheme === 'light-theme') ? 'dark-theme' : 'light-theme';
      this.themeService.themeSubject$.next({ theme });
      localStorage.setItem('theme', theme);
      this.themeService.setActiveTheme(selectedTheme);
    }
}

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.registerForm.invalid) {
          return;
      }

      // display form values on success
      alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
  }

  onReset() {
      this.submitted = false;
      this.registerForm.reset();
  }

  windowScroll() {
    window.addEventListener('scroll', (event) => {
      if (this.scrollingId) {
        return;
      }
      this.scrollingId = true;
      window.requestAnimationFrame(()=>{})
        ? setTimeout(() => {
            this.autoHideHeader();
          }, 250)
        : window.requestAnimationFrame(() => {
            this.autoHideHeader();
          });
    });
  }

  autoHideHeader(): void {
    const currentTop = document.documentElement.scrollTop;
    this.checkSimpleNavigation(currentTop);
    this.previousTop = currentTop;
    this.scrollingId = false;
  }

  checkSimpleNavigation(currentTop: any): void {
    if (this.previousTop - currentTop > this.scrollDelta) {

      Util.removeClass(this.mainHeader, 'is-header-hidden');
    } else if (
      currentTop - this.previousTop > this.scrollDelta &&
      currentTop > this.scrollOffset
    ) {
      Util.addClass(this.mainHeader, 'is-header-hidden');
    }
  }

  handleClick(event: Event, headerEl: any, headerNavEl: any) {
    event.preventDefault();
    const status = !Util.hasClass(event.target, 'anim-menu-btn--state-b');
    const headerStatus = !Util.hasClass(headerEl, 'f-header--expanded');
    const headerNavStatus = !Util.hasClass(
      headerNavEl,
      'f-header__nav--is-visible'
    );

    Util.toggleClass(event.target, 'anim-menu-btn--state-b', status);
    Util.toggleClass(headerEl, 'f-header--expanded', headerStatus);
    Util.toggleClass(
      headerNavEl,
      'f-header__nav--is-visible',
      headerNavStatus
    );
  }
}
