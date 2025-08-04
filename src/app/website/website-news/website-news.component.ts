import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { NewsService, Haber, PagedResult } from '../../services/news.service';
import { FormsModule } from '@angular/forms';

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
  
  // Pagination
  currentPage = 1;
  pageSize = 12;
  totalItems = 0;
  totalPages = 0;
  
  // Categories (Bu liste backend'ten gelebilir)
  categories = [
    { id: 0, name: 'Tüm Kategoriler' },
    { id: 1, name: 'Teknoloji' },
    { id: 2, name: 'Spor' },
    { id: 3, name: 'Ekonomi' },
    { id: 4, name: 'Sağlık' },
    { id: 5, name: 'Eğitim' }
  ];

  constructor(
    private newsService: NewsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNews();
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
    this.newsService.searchNews(this.searchTerm, this.currentPage, this.pageSize).subscribe({
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
    this.selectedCategory = 0; // Arama yaparken kategori filtresini sıfırla
    this.loadNews();
  }

  onCategoryChange(): void {
    this.currentPage = 1;
    this.searchTerm = ''; // Kategori değiştirirken arama terimini sıfırla
    this.loadNews();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadNews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToNews(id: number): void {
    this.router.navigate(['/website/news', id]);
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
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  getCategoryName(categoryId?: number): string {
    if (!categoryId) return 'Genel';
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Genel';
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}
