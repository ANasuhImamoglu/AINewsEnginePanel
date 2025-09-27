import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { NewsService, Haber, PagedResult } from '../../services/news.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  slideClass = 'slide-enter';
  featuredNews: Haber[] = [];
  latestNews: Haber[] = [];
  mostReadNews: Haber[] = [];
  loading = true;
  currentFeaturedIndex = 0;

  // Üst Bilgi Alanı için property'ler
  currentTime: string = '';
  weatherInfo: string = '';
  exchangeRates: { USD?: string; EUR?: string; Gold?: string; BIST?: string } = {};


  constructor(
    private newsService: NewsService,
    private router: Router

    
  ) {}

  
  ngOnInit(): void {
    this.loadFeaturedNews();
    this.loadLatestNews();
    this.loadMostReadNews();
    setInterval(() => {
      this.nextFeatured();
    }, 5000); // 5 saniyede bir slider otomatik kayar

    // Saat bilgisini güncelle
    this.updateCurrentTime();
    setInterval(() => this.updateCurrentTime(), 1000);

    // Hava durumu ve döviz/borsa bilgilerini çek
    this.fetchWeatherInfo();
    this.fetchExchangeRates();
  }

  loadFeaturedNews(): void {
    // İlk 10 haberi öne çıkan haberler olarak al slider 
    this.newsService.getNews(1, 10).subscribe({
      next: (result: PagedResult<Haber>) => {
        this.featuredNews = result.items;
      },
      error: (error) => {
        console.error('Featured news loading error:', error);
      }
    });
  }

  loadLatestNews(): void {
    // Son 6 haberi al
    this.newsService.getNews(1, 6).subscribe({
      next: (result: PagedResult<Haber>) => {
        this.latestNews = result.items;
        this.loading = false;
      },
      error: (error) => {
        console.error('Latest news loading error:', error);
        this.loading = false;
      }
    });
  }

  loadMostReadNews(): void {
    // En çok okunan haberler - şimdilik aynı API'yi kullanıyoruz
    // Backend'te ayrı endpoint olduğunda değiştirilebilir
    this.newsService.getNews(1, 5).subscribe({
      next: (result: PagedResult<Haber>) => {
        this.mostReadNews = result.items;
      },
      error: (error) => {
        console.error('Most read news loading error:', error);
      }
    });
  }

  navigateToNews(news: Haber): void {
    const slug = NewsService.createSlug(news.baslik);
    this.router.navigate(['/website/news', news.id, slug]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  truncateText(text: string, maxLength: number = 150): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  prevFeatured(): void {
    if (this.featuredNews.length === 0) return;
    this.slideClass = 'slide-leave';
    setTimeout(() => {
      this.currentFeaturedIndex = (this.currentFeaturedIndex - 1 + this.featuredNews.length) % this.featuredNews.length;
      this.slideClass = 'slide-enter';
    }, 200);
  }

  nextFeatured(): void {
    if (this.featuredNews.length === 0) return;
    this.slideClass = 'slide-leave';
    setTimeout(() => {
      this.currentFeaturedIndex = (this.currentFeaturedIndex + 1) % this.featuredNews.length;
      this.slideClass = 'slide-enter';
    }, 200);
  }

  // Saat bilgisini güncelleyen fonksiyon
  updateCurrentTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  // Hava durumu bilgisini çeken fonksiyon (örnek: İstanbul)
  fetchWeatherInfo(): void {
    // Gerçek API ile entegre edilebilir, şimdilik dummy veri
    // Örnek: OpenWeatherMap API kullanılabilir
    this.weatherInfo = 'İstanbul, 27°C, Güneşli';
  }

  // Döviz ve borsa bilgilerini çeken fonksiyon
  fetchExchangeRates(): void {
    // Gerçek API ile entegre edilebilir, şimdilik dummy veri
    this.exchangeRates = {
      USD: '32.10',
      EUR: '34.50',
      Gold: '1950 TL/gram',
      BIST: '8.200'
    };
  }
}
