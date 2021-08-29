import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {

  constructor(
    private http: HttpClient
  ) {}

  createDomElement(url: string, fileName: string): void {
    const a: any = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();
  };

  downloadImage(imageSrcUrl: string, imageName: string): void {
    this.http.get(imageSrcUrl, { responseType: 'blob' }).subscribe(val => {
      const url = URL.createObjectURL(val);
      this.createDomElement(url, `${imageName}.jpeg`);
      URL.revokeObjectURL(url);
    });
  }

  handlePhotoNameFormat(imageNameUrl: string): string {
    return imageNameUrl.split('/').slice(4)[0];
  }

}
