import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, scan, switchMap, takeWhile } from 'rxjs/operators';
import { PexelsService } from '../services/pexels.service';
import { HeaderService } from '../header/header.service';
import { PexelData } from '../models/pexel-data';

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

  photoColumns$ = combineLatest([this.queryParams$, this.pageNumberObs$])
    .pipe(
      switchMap((data): Observable<PexelData> => {
        return this.pexelsService.getSearchPhotos(this.currentPage, data[0]?.query, data[0]?.color)
      }),
      map((data: PexelData) => {
        const perColumn = 10;
        const result = data.photos.reduce((resultArray: any, photo: any, index: number) => {
          let isLoadingImage: boolean = true;
          let imageMap = [
            `${photo.src.medium} 320w`,
            `${photo.src.large} 480w`,
            `${photo.src.large2x} 800w` ];
          let imageSize = [
            "(max-width: 320px) 280px",
            "(max-width: 480px) 440px",
            "800px" ];

          let aspectRatioPadding = 100 * photo.height / photo.width;
            photo = {...photo, aspectRatioPadding, imageMap, imageSize, isLoadingImage};
            const chunkIndex = Math.floor(index / perColumn);
            if(!resultArray[chunkIndex]) {
              resultArray[chunkIndex] = [];
            }
            resultArray[chunkIndex].push(photo);
          return resultArray;
        }, []);

        return result;
      }),
      takeWhile((data) => data.length),
      scan((previousPhotos: any[], currentPhotos: any[]) => {
      return [
        [...previousPhotos[0], ...currentPhotos[0]],
        [...previousPhotos[1], ...currentPhotos[1]],
        [...previousPhotos[2], ...currentPhotos[2]],
      ]
    })
  );

  constructor(
    private activatedRoute: ActivatedRoute,
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

}
