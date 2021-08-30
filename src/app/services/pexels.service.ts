import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PexelsService {
  private readonly _pexelsAPI: string = 'https://api.pexels.com/v1';
  private readonly _curatedPhotos: string = `${this._pexelsAPI}/curated`;
  private readonly _searchPhotos: string = `${this._pexelsAPI}/search`;
  private readonly _requestHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + '563492ad6f91700001000001cf90ff95995f419da77b43146fa201e6'
  });

  constructor(private http: HttpClient) { }

  private handleQueryParamCreation(paramSettings: any): HttpParams {
    if (paramSettings.color) {
      const params = new HttpParams()
        .set('query', paramSettings.query)
        .set('color', paramSettings.color)
        .set('per_page', 30)
        .set('page', paramSettings.pageNumber.toString())
      return params;
    } else {
      const params = new HttpParams()
      .set('query', paramSettings.query)
      .set('per_page', 30)
      .set('page', paramSettings.pageNumber.toString())
      return params;
    }
  }

  getCuratedPhotos(pageNumber: number): Observable<any> {
    return this.http.get(this._curatedPhotos, {
      headers: this._requestHeaders,
      params: {
        per_page: 30,
        page: pageNumber.toString()
      }
    });
  }

  getSearchPhotos(pageNumber: number, query: string, color?: string): Observable<any> {
    const queryStringSettings: any = { pageNumber, query, color };
    const params = this.handleQueryParamCreation(queryStringSettings);

    return this.http.get(this._searchPhotos, {
      headers: this._requestHeaders,
      params
    });
  }

}
