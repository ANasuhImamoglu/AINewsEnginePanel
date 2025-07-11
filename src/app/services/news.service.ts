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
import { environment } from '../../environments/environment';

export interface Haber {
  id: number;
  baslik: string;
  icerik: string;
  resimUrl: string;
  yayinTarihi: string;
  onaylandi: boolean;
  kategoriId?: number;
   okunduSayisi: number;
    tiklandiSayisi: number;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = `${environment.apiUrl}/Haberler`;

  constructor(private http: HttpClient) { }

  getNews(): Observable<Haber[]> {
    return this.http.get<Haber[]>(this.apiUrl);
  }

  // Backend'de arama yapan metod
  searchNews(searchTerm: string): Observable<Haber[]> {
    if (!searchTerm || searchTerm.trim() === '') {
      return this.getNews(); // Arama terimi boşsa tüm haberleri getir
    }
    return this.http.get<Haber[]>(`${this.apiUrl}/search?term=${encodeURIComponent(searchTerm.trim())}`);
  }

  approveNews(id: number): Observable<Haber> {
    return this.http.put<Haber>(`${this.apiUrl}/${id}/approve`, {});
  }

//

    fetchRssNews(rssUrl: string, kategoriId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/fetch-rss`, { rssUrl, kategoriId });
    }

    getMostReadNews(): Observable<Haber[]> {
        return this.http.get<Haber[]>(`${this.apiUrl}/most-read`);
    }

    getMostClickedNews(): Observable<Haber[]> {
        return this.http.get<Haber[]>(`${this.apiUrl}/most-clicked`);
    }

    incrementReadCount(id: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/increment-read`, {});
    }

    incrementClickCount(id: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/increment-click`, {});
    }
}


