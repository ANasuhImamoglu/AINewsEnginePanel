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
  okunmaSayisi: number;
  tiklanmaSayisi: number;
}

export interface PaginationInfo {
  totalItems: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PagedResult<T> {
  items: T[];
  pagination: PaginationInfo;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = `${environment.apiUrl}/Haberler`;

  constructor(private http: HttpClient) { }

  getNews(pageNumber: number = 1, pageSize: number = 10, kategoriId?: number): Observable<PagedResult<Haber>> {
    let params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (kategoriId && kategoriId !== 0) {
      params += `&kategoriId=${kategoriId}`;
    }
    return this.http.get<PagedResult<Haber>>(`${this.apiUrl}${params}`);
  }

  // Geriye uyumluluk için eski metod (deprecated)
  getAllNews(): Observable<Haber[]> {
    return this.http.get<Haber[]>(`${this.apiUrl}/all`);
  }

  // Backend'de arama yapan metod - şimdilik client-side filtreleme kullanıyoruz
  searchNews(searchTerm: string, pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<Haber>> {
    // Şimdilik tüm haberleri getirip client-side filtreleme yapıyoruz
    // Gerçek backend implementasyonu için backend'e search endpoint'i eklenmesi gerekiyor
    return this.getNews(pageNumber, pageSize);
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
        return this.http.post(`${this.apiUrl}/${id}/okundu`, {});
    }

    incrementClickCount(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/tiklandi`, {});
    }
}


