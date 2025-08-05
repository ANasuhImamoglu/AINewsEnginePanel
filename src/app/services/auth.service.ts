import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id?: number;
  username: string;
  password?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}

export interface LoginRequest {
  Username: string;
  Password: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
  roles: string[];
}

export interface RegisterRequest {
  Username: string;
  Password: string;
  Email?: string;
}

export interface RegisterResponse {
  Status: string;
  Message: string;
  Errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/Auth`;
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {
    // localStorage'dan token ve user bilgilerini yükle
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      try {
        this.currentUser = JSON.parse(savedUser);
        console.log('Saved user loaded:', this.currentUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        this.clearLocalStorage();
      }
    } else {
      console.log('No saved user or token found');
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUser;
  }

  // Backend API ile login
  login(username: string, password: string): Observable<boolean> {
    const loginData: LoginRequest = { Username: username, Password: password };
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        map((response: LoginResponse) => {
          if (response.token) {
            // Token'ı localStorage'a kaydet
            localStorage.setItem('token', response.token);
            
            // Kullanıcı bilgilerini oluştur
            const user: User = {
              username: username,
              role: response.roles?.[0] || 'user', // İlk rolü al
              isActive: true
            };
            
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUser = user;
            
            return true;
          }
          return false;
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return of(false);
        })
      );
  }

  // Backend API ile logout
  logout(): Observable<any> {
    // Backend'de logout endpoint'i olmadığı için sadece yerel temizlik
    this.clearLocalStorage();
    return of({});
  }

  private clearLocalStorage(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUser = null;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  // Backend API ile kayıt olma işlemi
  register(registerData: { username: string; password: string }): Observable<{ success: boolean; message: string }> {
    const backendData: RegisterRequest = { 
      Username: registerData.username, 
      Password: registerData.password,
      Email: registerData.username // Backend'de email olarak username kullanılıyor
    };
    
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, backendData)
      .pipe(
        map((response: RegisterResponse) => {
          if (response.Status === 'Success') {
            return {
              success: true,
              message: response.Message
            };
          } else {
            return {
              success: false,
              message: response.Message
            };
          }
        }),
        catchError((error) => {
          console.error('Register API error:', error);
          console.error('Error status:', error.status);
          console.error('Error details:', error.error);
          console.error('Full error object:', JSON.stringify(error, null, 2));
          
          // Backend hatası durumunda kullanıcı dostu mesaj döndür
          let errorMessage = 'Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.';
          
          // Backend'den gelen detaylı hata mesajını kontrol et
          if (error.error) {
            if (error.error.Message) {
              errorMessage = error.error.Message;
            } else if (error.error.message) {
              errorMessage = error.error.message;
            } else if (error.error.title) {
              errorMessage = error.error.title;
            } else if (typeof error.error === 'string') {
              errorMessage = error.error;
            }
          }
          
          // HTTP status kodlarına göre özel mesajlar
          if (error.status === 400) {
            errorMessage = 'Girilen bilgiler geçersiz. Lütfen kontrol edin.';
          } else if (error.status === 409) {
            errorMessage = 'Bu kullanıcı adı zaten kullanılıyor.';
          } else if (error.status === 0) {
            errorMessage = 'Sunucuya bağlanılamıyor. Backend çalışıyor mu?';
          } else if (error.status === 500) {
            if (error.error && error.error.message) {
              errorMessage = `Sunucu hatası: ${error.error.message}`;
            } else {
              errorMessage = 'Sunucu hatası. Backend log\'larını kontrol edin.';
            }
          }
          
          return of({
            success: false,
            message: errorMessage
          });
        })
      );
  }

  // Token doğrulama - backend'de endpoint yoksa basit kontrol
  validateToken(): Observable<boolean> {
    const token = this.getToken();
    
    if (!token) {
      return of(false);
    }
    
    // JWT token'ın süresi dolmuş mu kontrol et (basit)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < currentTime) {
        // Token süresi dolmuş
        this.clearLocalStorage();
        return of(false);
      }
      
      return of(true);
    } catch (error) {
      // Token parse edilemedi, geçersiz
      this.clearLocalStorage();
      return of(false);
    }
  }

  // Backend bağlantısını test et
  testConnection(): Observable<boolean> {
    // Basit bir GET isteği gönder
    return this.http.get<any>(`${environment.apiUrl}/api/Haberler`).pipe(
      map(() => true), // Başarılı response
      catchError((error) => {
        // 401, 403 gibi auth hataları backend'in çalıştığını gösterir
        if (error.status === 401 || error.status === 403) {
          return of(true);
        }
        console.error('Backend connection test failed:', error);
        return of(false);
      })
    );
  }

  // Mevcut kullanıcının username'ini döndür
  getCurrentUsername(): string {
    if (this.currentUser && this.currentUser.username) {
      return this.currentUser.username;
    }
    
    // Token'dan username'i çıkarmaya çalış
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.unique_name || payload.sub || 'Kullanıcı';
      } catch (error) {
        console.error('Token parse error:', error);
      }
    }
    
    return 'Kullanıcı';
  }

  // Mevcut kullanıcının ID'sini döndür
  getCurrentUserId(): number {
    if (this.currentUser && this.currentUser.id) {
      return this.currentUser.id;
    }
    
    // Token'dan user ID'yi çıkarmaya çalış
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return parseInt(payload.nameid || payload.user_id || '1');
      } catch (error) {
        console.error('Token parse error:', error);
      }
    }
    
    return 1; // Default user ID
  }

  // Mevcut kullanıcı bilgilerini döndür
  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
