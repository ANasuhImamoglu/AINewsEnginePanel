import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {
  
  constructor(private http: HttpClient) { }

  // Backend API'nin çalışıp çalışmadığını kontrol et
  checkBackendHealth(): Observable<{ status: string; message: string }> {
    // Haberler endpoint'ini kullanarak backend bağlantısını test et
    return this.http.get<any>(`${environment.apiUrl}/Haberler`, {
      // Auth gerekirse token eklenecek (interceptor tarafından)
    }).pipe(
      map(() => ({
        status: 'success',
        message: 'Backend API bağlantısı başarılı!'
      })),
      catchError((error) => {
        console.error('Backend health check failed:', error);
        
        // 401 Unauthorized = Backend çalışıyor ama auth gerekiyor
        if (error.status === 401) {
          return of({
            status: 'warning',
            message: 'Backend API çalışıyor (Authentication gerekli)'
          });
        }
        
        // 403 Forbidden = Backend çalışıyor ama yetki yok
        if (error.status === 403) {
          return of({
            status: 'warning', 
            message: 'Backend API çalışıyor (Yetki gerekli)'
          });
        }
        
        let message = 'Backend API\'ye bağlanılamıyor.';
        
        if (error.status === 0) {
          message = 'Backend sunucusuna bağlanılamıyor. Sunucu çalışmıyor veya CORS ayarları hatalı.';
        } else if (error.status === 404) {
          message = 'Backend API endpoint\'leri bulunamıyor. API URL\'ini kontrol edin.';
        } else if (error.status >= 500) {
          message = 'Backend sunucusunda hata var.';
        }
        
        return of({ status: 'error', message });
      })
    );
  }

  // Test verisi almayı dene
  testDataFetch(): Observable<{ status: string; message: string; data?: any }> {
    return this.http.get<any>(`${environment.apiUrl}/Auth/test`)
      .pipe(
        map((data) => ({ 
          status: 'success', 
          message: 'Test verisi başarıyla alındı!',
          data 
        })),
        catchError((error) => {
          console.error('Test data fetch failed:', error);
          throw { 
            status: 'error', 
            message: 'Test verisi alınamadı: ' + (error.error?.message || error.message || 'Bilinmeyen hata')
          };
        })
      );
  }
}
