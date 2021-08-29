import { Component, TemplateRef } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, scan } from 'rxjs/operators';
import { ModalService } from '../library/modal/modal.service';
import { PexelsService } from '../services/pexels.service';
import { DownloadService } from '../services/download.service';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  pauseInfiniteScrollSub: Subscription;
  isPauseScroll: boolean;

  constructor(
    private pexelsService: PexelsService,
    private modalService: ModalService,
    private downloadService: DownloadService,
    private homeService: HomeService
  ) {
    window.scrollTo(0, 0);
    this.pauseInfiniteScrollSub = this.homeService.changeScrollStatusObs().subscribe((scrollStatus: boolean) => {
      this.isPauseScroll = scrollStatus;
    });
  }

  posts$ = this.pexelsService.posts$.pipe(
    map((data: any, mapIndex: any) => {
      const perColumn = 10;

        let result = data[mapIndex].photos.reduce((resultArray: any, item: any, index: number) => {

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

  pageCount: number = 1;
  photoCollections: any;
  currentPage = 1;
  pageNumberSubject = new BehaviorSubject<number>(1);
  pageSizeAction$ = this.pageNumberSubject.asObservable();

  next() {
    this.isPauseScroll = !this.isPauseScroll;
  }

  onScroll() {
    this.pexelsService.currentPage += 1;
    this.pexelsService.nextPage(this.pexelsService.currentPage);
  }

  open(tpl: TemplateRef<any>) {
    this.modalService.open(tpl);
  }

  handleImageDownload(imageSrcUrl: string, imageNameUrl: string): void {
    const splitImageName = this.downloadService.handlePhotoNameFormat(imageNameUrl);
    this.downloadService.downloadImage(imageSrcUrl, splitImageName);
  }

}
