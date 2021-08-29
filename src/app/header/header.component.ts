import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Util } from '../util/util';
import { ThemeService } from '../services/theme.service';
import { HomeService } from '../home/home.service';
import { Router } from '@angular/router';

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

  searchForm: FormGroup;
  submitted = false;
  isDefaultInputActive: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private homeService: HomeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      searchType: ['Default', Validators.required],
      searchStringDefault: [{value: '', disabled: false}, Validators.required],
      searchStringHexColor: [{value: '#000000', disabled: true}, Validators.required],
    });
    this.windowScroll();
    this.handleSearchFormTypeChange();
  }

  get userPrefs() {
    return this.themeService.userPrefs$;
  }

  get isScrollPaused() {
    return this.homeService.isScrollPaused;
  }

  get nextTheme() {
    return this.themeService.nextTheme;
  }

  handleSearchFormTypeChange(): void {
    const searchType = this.searchForm.get('searchType');
    const searchStringDefault = this.searchForm.get('searchStringDefault');
    const searchStringHexColor = this.searchForm.get('searchStringHexColor');

    searchType?.valueChanges.subscribe((data: string) => {
      if (data === 'Default') {
        searchStringHexColor?.disable();
        searchStringDefault?.enable();
        this.isDefaultInputActive = true;
      } else {
        searchStringDefault?.disable();
        searchStringHexColor?.enable();
        this.isDefaultInputActive = false;
      }
    });
  }

  handleThemeChange(selectedTheme: string | null) {
    if (selectedTheme) {
      let theme = (selectedTheme === 'light-theme') ? 'dark-theme' : 'light-theme';
      this.themeService.themeSubject$.next({ theme });
      localStorage.setItem('theme', theme);
      this.themeService.setActiveTheme(theme);
    }
}

  onSubmit() {
      this.submitted = true;

      if (this.searchForm.invalid) {
          return;
      }

      this.router.navigate([ 'search' ], { queryParams: { searchType: 'deafult', searchValue: '' } });

      // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.searchForm.value, null, 4));
  }

  onReset() {
      this.submitted = false;
      this.searchForm.reset();
  }

  windowScroll() {
    window.addEventListener('scroll', () => {
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

  handleScrollStatus(): void {
    this.homeService.changeScrollStatus();
  }
}
