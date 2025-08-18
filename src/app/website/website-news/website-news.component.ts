import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { NewsService, Haber, PagedResult } from '../../services/news.service';
import { CategoryService, Category } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-website-news',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule],
  templateUrl: './website-news.component.html',
  styleUrls: ['./website-news.component.css']
})
export class WebsiteNewsComponent implements OnInit {
  news: Haber[] = [];
  loading = true;
  searchTerm = '';
  selectedCategory = 0;
  categories: Category[] = [];
  
  // Pagination
  currentPage = 1;
  pageSize = 12;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private newsService: NewsService,
    private categoryService: CategoryService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
  this.loadCategories();
  this.loadNews();
  }

  loadCategories(): void {
    this.categoryService.getCategoriesForFilter().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Categories loading error:', error);
        // Fallback kategoriler
        this.categories = [
          { id: 0, name: 'Tüm Kategoriler' },
          { id: 1, name: 'Teknoloji' },
          { id: 2, name: 'Spor' },
          { id: 3, name: 'Ekonomi' },
          { id: 4, name: 'Sağlık' },
          { id: 5, name: 'Eğitim' }
        ];
      }
    });
  }

  loadNews(): void {
    this.loading = true;
    const categoryId = this.selectedCategory === 0 ? undefined : this.selectedCategory;
    
    if (this.searchTerm.trim()) {
      this.searchNews();
    } else {
      this.newsService.getNews(this.currentPage, this.pageSize, categoryId).subscribe({
        next: (result: PagedResult<Haber>) => {
          this.news = result.items;
          this.totalItems = result.pagination.totalItems;
          this.totalPages = result.pagination.totalPages;
          this.loading = false;
        },
        error: (error) => {
          console.error('News loading error:', error);
          this.loading = false;
        }
      });
    }
  }

  searchNews(): void {
    const categoryId = this.selectedCategory === 0 ? undefined : this.selectedCategory;
    
    this.newsService.searchNews(this.searchTerm, this.currentPage, this.pageSize, categoryId).subscribe({
      next: (result: PagedResult<Haber>) => {
        this.news = result.items;
        this.totalItems = result.pagination.totalItems;
        this.totalPages = result.pagination.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    // Arama yaparken kategori filtresini sıfırlama - kullanıcı kategori seçmişse korunur
    this.loadNews();
  }

  onCategoryChange(): void {
    this.currentPage = 1;
    // Kategori değiştirirken arama terimini koruyabiliriz veya sıfırlayabiliriz
    // this.searchTerm = ''; // Bu satırı açarsanız kategori değiştiğinde arama sıfırlanır
    this.loadNews();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadNews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToNews(news: Haber): void {
    const slug = NewsService.createSlug(news.baslik);
    this.router.navigate(['/website/news', news.id, slug]);
  }

  getPaginationPages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
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

  truncateText(text: string, maxLength: number = 200): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
  }

  getCategoryName(categoryId?: number): string {
    return this.categoryService.getCategoryName(categoryId);
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}
