import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { NewsService, Haber } from '../../services/news.service';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, CommentsComponent],
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css']
})
export class NewsDetailComponent implements OnInit {
  news: Haber | null = null;
  loading = true;
  error = false;
  relatedNews: Haber[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadNewsDetail(id);
        this.loadRelatedNews(id);
      }
    });
  }

  loadNewsDetail(id: number): void {
    // Şimdilik getNews ile tek haberi simulate ediyoruz
    // Backend'te getNewsById endpoint'i olduğunda değiştirilecek
    this.newsService.getNews(1, 100).subscribe({
      next: (result) => {
        const foundNews = result.items.find(item => item.id === id);
        if (foundNews) {
          this.news = foundNews;
          this.updateReadCount(id);
        } else {
          this.error = true;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('News detail loading error:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadRelatedNews(currentId: number): void {
    this.newsService.getNews(1, 4).subscribe({
      next: (result) => {
        this.relatedNews = result.items.filter(item => item.id !== currentId).slice(0, 3);
      },
      error: (error) => {
        console.error('Related news loading error:', error);
      }
    });
  }

  updateReadCount(id: number): void {
    // Okunma sayısını artır - backend endpoint'i olduğunda implement edilecek
    if (this.news) {
      this.news.okunmaSayisi += 1;
    }
  }

  goBack(): void {
    this.router.navigate(['/website/news']);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getCategoryName(categoryId?: number): string {
    const categories: {[key: number]: string} = {
      1: 'Teknoloji',
      2: 'Spor', 
      3: 'Ekonomi',
      4: 'Sağlık',
      5: 'Eğitim'
    };
    return categoryId ? categories[categoryId] || 'Genel' : 'Genel';
  }

  shareNews(): void {
    if (navigator.share && this.news) {
      navigator.share({
        title: this.news.baslik,
        text: this.news.icerik.substring(0, 100) + '...',
        url: window.location.href
      });
    } else if (this.news) {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  }
}
