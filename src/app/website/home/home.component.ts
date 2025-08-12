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
  featuredNews: Haber[] = [];
  latestNews: Haber[] = [];
  mostReadNews: Haber[] = [];
  loading = true;

  constructor(
    private newsService: NewsService,
    private router: Router

    
  ) {}

  
  ngOnInit(): void {
    this.loadFeaturedNews();
    this.loadLatestNews();
    this.loadMostReadNews();
  }

  loadFeaturedNews(): void {
    // İlk 3 haberi öne çıkan haberler olarak al
    this.newsService.getNews(1, 3).subscribe({
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
    this.router.navigate(['/website/news', news.id, slug]);
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
}
