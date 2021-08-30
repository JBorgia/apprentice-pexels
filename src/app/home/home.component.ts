import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, scan, switchMap, takeWhile } from 'rxjs/operators';
import { PexelsService } from '../services/pexels.service';
import { HeaderService } from '../header/header.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  currentPage = Math.floor(Math.random() * 100) + 1;
  pauseInfiniteScrollSub: Subscription;
  isPauseScroll: boolean = false;
  subs: Subscription[] = [];

  pageNumberBehaviorSub = new BehaviorSubject<number>(this.currentPage);
  pageNumberObs$ = this.pageNumberBehaviorSub.asObservable();

  photoColumns$ = this.pageNumberObs$.pipe(
    switchMap((): Observable<any> => this.pexelsService.getCuratedPhotos(this.currentPage)),
    map(ret => [ret]),
    scan((allPosts: any[], pageUsers: any[]) => [...allPosts, ...pageUsers]),
      map((data: any, mapIndex: any) => {
      const perColumn = 10;
        const result = data[mapIndex].photos.reduce((resultArray: any, item: any, index: number) => {

          let isLoadingImage: boolean = true;
          let imageMap = [
            `${item.src.medium} 320w`,
            `${item.src.large} 480w`,
            `${item.src.large2x} 800w`
          ];

          let imageSize = [
            "(max-width: 320px) 280px",
            "(max-width: 480px) 440px",
            "800px"
          ];

          let aspectRatioPadding = 100 * item.height / item.width;
            item = {...item, aspectRatioPadding, imageMap, imageSize, isLoadingImage};
            const chunkIndex = Math.floor(index / perColumn);
            if(!resultArray[chunkIndex]) {
              resultArray[chunkIndex] = [];
            }
            resultArray[chunkIndex].push(item);
          return resultArray;
        }, []);

      return result;
    }),
    takeWhile((data) => {
      return data.length;
    }),
    scan((allPosts: any[], pageUsers: any[]) => {
      return [
        [...allPosts[0], ...pageUsers[0]],
        [...allPosts[1], ...pageUsers[1]],
        [...allPosts[2], ...pageUsers[2]],
      ]
    })
  );

  constructor(
    private pexelsService: PexelsService,
    private headerService: HeaderService
  ) {
    window.scrollTo(0, 0);
    this.subs.push(
      this.pauseInfiniteScrollSub = this.headerService.changeScrollStatusObs().subscribe((scrollStatus: boolean) => {
        this.isPauseScroll = scrollStatus;
      })
    );
  }

  ngOnInit(): void {
    this.resetScrollStatus();
  }

  resetScrollStatus(): void {
    if (this.isPauseScroll) {
      this.headerService.changeScrollStatus();
    }
  }

  onScroll(): void {
    this.currentPage += 1;
    this.pageNumberBehaviorSub.next(this.currentPage);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
