// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class NewsService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Haber {
  id: number;
  baslik: string;
  icerik: string;
  resimUrl: string;
  yayinTarihi: string;
  onaylandi: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'https://localhost:7104/api/Haberler';

  constructor(private http: HttpClient) { }

  getNews(): Observable<Haber[]> {
    return this.http.get<Haber[]>(this.apiUrl);
  }

  approveNews(id: number): Observable<Haber> {
    return this.http.put<Haber>(`${this.apiUrl}/${id}/approve`, {});
  }


}