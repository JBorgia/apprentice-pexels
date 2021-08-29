import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {

  private subject = new Subject<boolean>();
  isScrollPaused: boolean = false;

  changeScrollStatus() {
      this.isScrollPaused = !this.isScrollPaused;
      this.subject.next(this.isScrollPaused);
  }

  changeScrollStatusObs(): Observable<boolean> {
    return this.subject.asObservable();
  }

}
