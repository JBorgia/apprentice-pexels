import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { concatMap, map, scan } from 'rxjs/operators';
import { PexelsService } from '../services/pexels.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  currentPage = 1;
  pauseInfiniteScrollSub: Subscription;
  isPauseScroll: boolean = false;
  subs: Subscription[] = [];

  pageNumberBehaviorSub = new BehaviorSubject<number>(this.currentPage);
  pageNumberObs$ = this.pageNumberBehaviorSub.asObservable();

  queryParams$ = this.activatedRoute.queryParams;

  photoColumns$ = this.pageNumberObs$.pipe(
    concatMap((): Observable<any> => this.pexelsService.getSearchPhotos(this.currentPage, 'flowers', 'violet')),
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
    scan((allPosts: any[], pageUsers: any[]) => {
      return [
        [...allPosts[0], ...pageUsers[0]],
        [...allPosts[1], ...pageUsers[1]],
        [...allPosts[2], ...pageUsers[2]],
      ]
    })
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private pexelsService: PexelsService
  ) {
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    // this.queryParams$.subscribe(data => console.log(data));
  }

  onScroll(): void {
    this.currentPage += 1;
    this.pageNumberBehaviorSub.next(this.currentPage);
  }

}
