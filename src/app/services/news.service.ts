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
import { map } from 'rxjs/operators';
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
  private apiUrl = `${environment.apiUrl}/api/Haberler`;

  constructor(private http: HttpClient) { }

  getNews(pageNumber: number = 1, pageSize: number = 10, kategoriId?: number): Observable<PagedResult<Haber>> {
    // Backend'te "page" parametresi beklendiği için "page" kullan
    let params = `?page=${pageNumber}&pageSize=${pageSize}`;
    if (kategoriId && kategoriId !== 0) {
      params += `&kategoriId=${kategoriId}`;
    }
    console.log(`xxxxxx:${this.apiUrl}${params}`)
    return this.http.get<any>(`${this.apiUrl}${params}`).pipe(
      map((response: any) => {
        // Backend'ten gelen format: { data: [...], totalCount: number }
        // Frontend'in beklediği format: PagedResult<Haber>
        const totalPages = Math.ceil(response.totalCount / pageSize);
        
        return {
          items: response.data,
          pagination: {
            pageNumber: pageNumber,
            pageSize: pageSize,
            totalItems: response.totalCount,
            totalPages: totalPages
          }
        } as PagedResult<Haber>;
      })
    );
  }

  // Geriye uyumluluk için eski metod (deprecated)
  getAllNews(): Observable<Haber[]> {
    return this.http.get<Haber[]>(`${this.apiUrl}/all`);
  }

  // Backend'e arama isteği gönderen metod
  searchNews(searchTerm: string, pageNumber: number = 1, pageSize: number = 10): Observable<PagedResult<Haber>> {
    if (!searchTerm || searchTerm.trim() === '') {
      return this.getNews(pageNumber, pageSize); // Arama terimi boşsa tüm haberleri getir
    }
    
    // Backend'e search isteği gönder - Backend'te "page" parametresi beklendiği için "page" kullan
    let params = `?term=${encodeURIComponent(searchTerm.trim())}&page=${pageNumber}&pageSize=${pageSize}`;
    
    return this.http.get<any>(`${this.apiUrl}/search${params}`).pipe(
      map((response: any) => {
        // Backend'ten gelen format: { data: [...], totalCount: number }
        // Frontend'in beklediği format: PagedResult<Haber>
        const totalPages = Math.ceil(response.totalCount / pageSize);
        
        return {
          items: response.data,
          pagination: {
            pageNumber: pageNumber,
            pageSize: pageSize,
            totalItems: response.totalCount,
            totalPages: totalPages
          }
        } as PagedResult<Haber>;
      })
    );
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

    getTop5ReadNews(): Observable<Haber[]> {
      return this.http.get<Haber[]>(`${this.apiUrl}/GetTop5ReadNews`);
    }

    incrementReadCount(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/okundu`, {});
    }

    incrementClickCount(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/tiklandi`, {});
    }
}


