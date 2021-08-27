import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { concatMap, scan, map, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class PexelsService {
  isLastPage = false;
  currentPage = 1;
  private pageNumberSubject = new BehaviorSubject<number>(1);
  pageSizeAction$ = this.pageNumberSubject.asObservable();

  private readonly _allPostsAPI: string =
    "https://api.pexels.com/v1/curated?per_page=30";

  httpHeaders = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "application/json"
    })
  };

  constructor(private http: HttpClient) {}

  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + '563492ad6f91700001000001ae87d3dc03f74053bdfdd1ca0729e076'
  });

  posts$ = this.pageSizeAction$.pipe(
      concatMap(
        (pgNum: number): Observable<any> =>
          this.http.get(this._allPostsAPI, {
            headers: this.reqHeader,
            params: {
              page: pgNum.toString()
            }
          })
      ),
      map(ret => [ret]),
      scan((allPosts: any[], pageUsers: any[]) => [...allPosts, ...pageUsers])
    );

  nextPage(page: number) {
    this.pageNumberSubject.next(page);
  }

  searchPhotos(query: string, page: number = 1) {
    return this.http.get(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=30&page=${page}`)
  }
}
