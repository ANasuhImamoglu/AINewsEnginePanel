import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NewsService, Haber, PagedResult, PaginationInfo } from '../services/news.service';
import { NewsDialogComponent } from './news-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-grid',
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule, 
    MatTableModule, 
    MatButtonModule, 
    MatDialogModule, 
    MatIconModule, 
    MatSnackBarModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './news-grid.component.html',
  styleUrls: ['./news-grid.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NewsGridComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  dataSource = new MatTableDataSource<Haber>([]);
  displayedColumns: string[] = ['baslik', 'icerik', 'yayinTarihi', 'kategoriId', 'actions'];
  searchTerm: string = '';
  
  // Sayfalama için yeni özellikler
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  
  // Kategori filtreleme için
  selectedKategoriId?: number;
  
  // Arama için orijinal data
  allNewsData: Haber[] = [];
  
  // Arama durumu takibi
  isSearching: boolean = false;

  constructor(
    private newsService: NewsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadNews();
  }

  ngAfterViewInit(): void {
    // Backend'den sayfalama yapıldığı için Mat-Table paginator'ını devre dışı bırakıyoruz
    this.dataSource.paginator = null;
  }

  loadNews(): void {
    this.newsService.getNews(this.currentPage, this.pageSize, this.selectedKategoriId).subscribe({
      next: (pagedResult: PagedResult<Haber>) => {
        this.allNewsData = pagedResult.items;
        this.dataSource.data = pagedResult.items;
        this.totalItems = pagedResult.pagination.totalItems;
        this.totalPages = pagedResult.pagination.totalPages;
        this.currentPage = pagedResult.pagination.pageNumber;
        this.pageSize = pagedResult.pagination.pageSize;
        this.isSearching = false; // Arama durumunu sıfırla
      },
      error: (err) => {
        console.error('Haberler yüklenemedi:', err);
        this.snackBar.open('Haberler yüklenemedi', 'Kapat', { duration: 3000 });
      }
    });
  }

  // Sayfa değişikliği için yeni metodlar
  onPageChange(direction: 'prev' | 'next' | 'first' | 'last' | number): void {
    if (typeof direction === 'number') {
      this.currentPage = direction;
    } else {
      switch (direction) {
        case 'prev':
          if (this.currentPage > 1) this.currentPage--;
          break;
        case 'next':
          if (this.currentPage < this.totalPages) this.currentPage++;
          break;
        case 'first':
          this.currentPage = 1;
          break;
        case 'last':
          this.currentPage = this.totalPages;
          break;
      }
    }
    
    // Arama aktifse arama ile sayfa değiştir, değilse normal yükle
    if (this.isSearching) {
      this.performServerSideSearch();
    } else {
      this.loadNews();
    }
  }

  // Server-side arama metodu - Backend'e istek gönderir
  performServerSideSearch(): void {
    if (!this.searchTerm.trim()) {
      // Arama terimi boşsa normal yükleme yap
      this.isSearching = false;
      this.loadNews();
      return;
    }

    this.isSearching = true;
    this.newsService.searchNews(this.searchTerm, this.currentPage, this.pageSize).subscribe({
      next: (pagedResult: PagedResult<Haber>) => {
        this.allNewsData = pagedResult.items;
        this.dataSource.data = pagedResult.items;
        this.totalItems = pagedResult.pagination.totalItems;
        this.totalPages = pagedResult.pagination.totalPages;
        this.currentPage = pagedResult.pagination.pageNumber;
        this.pageSize = pagedResult.pagination.pageSize;
      },
      error: (err) => {
        console.error('Arama sonuçları yüklenemedi:', err);
        this.snackBar.open('Arama sonuçları yüklenemedi', 'Kapat', { duration: 3000 });
        // Hata durumunda client-side arama'ya geri dön
        this.applyClientSideFilter();
      }
    });
  }

  // Basit client-side arama (fallback olarak)
  applyClientSideFilter(): void {
    if (!this.searchTerm.trim()) {
      this.dataSource.data = [...this.allNewsData];
      return;
    }

    const searchText = this.searchTerm.toLowerCase().trim();
    const filtered = this.allNewsData.filter(haber => {
      const baslik = haber.baslik ? haber.baslik.toLowerCase() : '';
      const icerik = haber.icerik ? haber.icerik.toLowerCase() : '';
      
      return baslik.includes(searchText) || icerik.includes(searchText);
    });
    
    this.dataSource.data = filtered;
  }

  applyFilter(): void {
    // İlk sayfaya git ve server-side arama yap
    this.currentPage = 1;
    this.performServerSideSearch();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.isSearching = false;
    this.currentPage = 1;
    this.loadNews(); // Normal veri yükleme
  }

  // Kategori filtreleme
  filterByCategory(kategoriId?: number): void {
    this.selectedKategoriId = kategoriId;
    this.currentPage = 1;
    this.loadNews();
  }

  // Sayfa numaraları için yardımcı metodlar
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  /* Removed duplicate openNewsDialog implementation */

  approveNews(id: number): void {
    this.newsService.approveNews(id).subscribe({
      next: (updatedHaber) => {
        this.snackBar.open('Haber onaylandı', 'Kapat', { duration: 3000 });
        // Mevcut sayfayı yenile
        if (this.isSearching) {
          this.performServerSideSearch();
        } else {
          this.loadNews();
        }
        console.log(`Haber ${id} onaylandı`);
      },
      error: (err) => {
        console.error('Haber onaylanamadı:', err);
        this.snackBar.open('Haber onaylanamadı', 'Kapat', { duration: 3000 });
      }
    });
  }

  truncateText(text: string, maxLength: number = 50): string {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }




  openNewsDialog(haber: Haber): void {
        this.newsService.incrementClickCount(haber.id).subscribe({
            next: () => console.log(`Tıklanma sayısı artırıldı: ${haber.id}`),
            error: (err) => console.error('Tıklanma sayısı artırılamadı:', err)
        });

        const dialogRef = this.dialog.open(NewsDialogComponent, {
            width: '600px',
            data: haber
        });

        const readTimer = setTimeout(() => {
            this.newsService.incrementReadCount(haber.id).subscribe({
                next: () => console.log(`Okunma sayısı artırıldı: ${haber.id}`),
                error: (err) => console.error('Okunma sayısı artırılamadı:', err)
            });
        }, 4000); // 4 saniye

        dialogRef.afterClosed().subscribe(() => {
            clearTimeout(readTimer);
            // Mevcut sayfadaki verileri yenile
            if (this.isSearching) {
                this.performServerSideSearch();
            } else {
                this.loadNews();
            }
        });
    }

    navigateToMostReadClicked(): void {
        this.router.navigate(['/most-read-clicked']);
    }

    // Sayfa boyutu değişikliği
  onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.currentPage = 1; // İlk sayfaya git
    this.loadNews();
  }

  // Math nesnesini template'da kullanabilmek için
  Math = Math;
}




