
// src/app/most-read-news/most-read-news.component.ts
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common'; // ngFor, ngIf, date pipe için
import { RouterModule } from '@angular/router'; // routerLink için
import { HttpClientModule } from '@angular/common/http'; // API istekleri için
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // HTML içeriği güvenliği için

// Material Design Modülleri (Kullanılacak ikonlar için MatIconModule, buton için MatButtonModule)
import { MatCardModule } from '@angular/material/card'; // Eğer kart yapısı kullanmaya devam edilecekse
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Yükleniyor spinnerı için
import { MatTableModule } from '@angular/material/table'; // Yeni eklenen modül
import { NewsService, Haber } from '../services/news.service'; // NewsService ve Haber interface'i
import { NewsGridComponent } from '../news-grid/news-grid.component'; // Eğer grid bileşeni kullanılacaksa

// Güvenli HTML için Pipe (Gerekliyse)
@Pipe({ name: 'safeHtml', standalone: true })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}
  transform(value: string): SafeHtml {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-most-read-news',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MatCardModule, // Eğer kart yapısı kullanmaya devam edeceksek
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    SafeHtmlPipe
  ],
  providers: [NewsGridComponent],
  templateUrl: './most-read-news.component.html',
  styleUrls: ['./most-read-news.component.css']
})
export class MostReadNewsComponent implements OnInit {
  mostReadNews: Haber[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private newsService: NewsService, private newsGridService: NewsGridComponent) { }
//burası çalışma zamanında en çok okunan haberleri çekmek için kullanılır
  // OnInit yaşam döngüsü metodu, bileşen yüklendiğinde çağrılır
  ngOnInit(): void {
    this.getMostReadNews();
  }

  getMostReadNews(): void {
    
    this.newsService.getMostReadNews().subscribe({
      next: (data) => {
        this.mostReadNews = data;
        this.isLoading = false;
        this.error = null;
      },
      error: (err) => {
        console.error('En çok okunan haberler çekilirken hata oluştu:', err);
        this.error = 'Haberler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.';
        this.isLoading = false;
      }
    });
  }

test(haber: Haber): void {
  this.newsGridService.openNewsDialog(haber);
}

  
  // Kategori ID'sine göre kategori adını döndüren metot (önceki gibi)
  getCategoryName(categoryId: number): string {
    switch (categoryId) {
      case 1:
        return 'Gündem';
      case 2:
        return 'Teknoloji';
      case 3:
        return 'Spor';
      case 4:
        return 'Ekonomi';
      case 5:
        return 'Sağlık';
      case 6:
        return 'Dünya';  
      // ... Diğer kategori ID'lerini ve isimlerini buraya ekleyin
      default:
        return 'Bilinmeyen Kategori';
    }
  }

  // İçeriği belirli bir karakter sayısına göre kısaltan metot
  // news.icerik.substring(0, 200) yerine bu metodu kullanacağız.
  // HTML etiketlerini temizlemek için ayrıca safeHtml pipe'ı da kullanılabilir.
  getShortenedContent(content: string | null): string {
    if (!content) {
      return 'İçerik bulunamadı.';
    }
    // HTML etiketlerini temizleyelim (örneğin <p> etiketlerini kaldırır)
    const strippedContent = content.replace(/<[^>]*>/g, '');
    if (strippedContent.length > 200) {
      return strippedContent.substring(0, 200) + '...';
    }
    return strippedContent;
  }
}