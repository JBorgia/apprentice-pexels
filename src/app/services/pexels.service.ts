import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class PexelsService {

  private readonly _curatePhotos: string = "https://api.pexels.com/v1/curated?per_page=30";
  private readonly _requestHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + '563492ad6f91700001000001ae87d3dc03f74053bdfdd1ca0729e076'
  });

  constructor(private http: HttpClient) { }

  curatedPhotos(pageName: number): Observable<any> {
    return this.http.get(this._curatePhotos, {
      headers: this._requestHeaders,
      params: {
        page: pageName.toString()
      }
    });
  }

  searchPhotos(query: string, page: number = 1) {
    return this.http.get(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=30&page=${page}`)
  }
}
