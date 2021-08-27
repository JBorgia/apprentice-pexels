import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UtilService } from '../services/util.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private util: UtilService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      search: ['', Validators.required],
    });
    this.windowScroll();
  }

  get f() { return this.registerForm.controls; }

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
      this.util.removeClass(this.mainHeader.nativeElement, 'is-header-hidden');
    } else if (
      currentTop - this.previousTop > this.scrollDelta &&
      currentTop > this.scrollOffset
    ) {
      this.util.addClass(this.mainHeader.nativeElement, 'is-header-hidden');
    }
  }

  handleClick(event: Event, headerEl: any, headerNavEl: any) {
    event.preventDefault();
    const status = !this.util.hasClass(event.target, 'anim-menu-btn--state-b');
    const headerStatus = !this.util.hasClass(headerEl, 'f-header--expanded');
    const headerNavStatus = !this.util.hasClass(
      headerNavEl,
      'f-header__nav--is-visible'
    );

    this.util.toggleClass(event.target, 'anim-menu-btn--state-b', status);
    this.util.toggleClass(headerEl, 'f-header--expanded', headerStatus);
    this.util.toggleClass(
      headerNavEl,
      'f-header__nav--is-visible',
      headerNavStatus
    );
  }
}
