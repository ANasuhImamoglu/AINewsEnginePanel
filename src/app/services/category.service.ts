import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/api/Kategoriler`;

  // Doğru kategori ID eşleştirmesi
  private categories: Category[] = [
    { id: 0, name: 'Tüm Kategoriler', description: 'Tüm kategorilerdeki haberler' },
    { id: 1, name: 'Gündem', description: 'Gündem haberleri' },
    { id: 2, name: 'Teknoloji', description: 'Teknoloji haberleri' },
    { id: 3, name: 'Spor', description: 'Spor haberleri' },
    { id: 4, name: 'Dünya', description: 'Dünya haberleri' },
    { id: 5, name: 'Sağlık', description: 'Sağlık haberleri' },
    { id: 6, name: 'Politika', description: 'Politika haberleri' }
  ];

  constructor(private http: HttpClient) { }

  // Tüm kategorileri getir
  getCategories(): Observable<Category[]> {
    // Backend hazır olunca bu endpoint kullanılacak:
    // return this.http.get<Category[]>(this.apiUrl);
    
    // Backend hazır olduğunda bu yorumu açın:
    /*
    return this.http.get<Category[]>(`${this.apiUrl}/aktif`).pipe(
      catchError(error => {
        console.error('Categories API error:', error);
        // Hata durumunda fallback kategorileri döndür
        return of(this.categories);
      })
    );
    */
    
    // Şimdilik sabit kategorileri döndür
    return of(this.categories);
  }

  // Tekil kategori getir
  getCategoryById(id: number): Observable<Category | undefined> {
    const category = this.categories.find(c => c.id === id);
    return of(category);
  }

  // Kategori adını getir
  getCategoryName(categoryId?: number): string {
    if (!categoryId || categoryId === 0) return 'Genel';
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Genel';
  }

  // Filtreleme için kullanılacak kategorileri getir (Tüm Kategoriler dahil)
  getCategoriesForFilter(): Observable<Category[]> {
    return of(this.categories);
  }

  // Sadece aktif kategorileri getir (Tüm Kategoriler hariç)
  getActiveCategories(): Observable<Category[]> {
    const activeCategories = this.categories.filter(c => c.id !== 0);
    return of(activeCategories);
  }
}
