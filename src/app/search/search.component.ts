import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  currentPage = Math.floor(Math.random() * 100) + 1;
  pauseInfiniteScrollSub: Subscription;
  isPauseScroll: boolean = false;
  subs: Subscription[] = [];

  pageNumberBehaviorSub = new BehaviorSubject<number>(this.currentPage);
  pageNumberObs$ = this.pageNumberBehaviorSub.asObservable();

  constructor() {
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
  }

  onScroll(): void {
    this.currentPage += 1;
    this.pageNumberBehaviorSub.next(this.currentPage);
  }

}
