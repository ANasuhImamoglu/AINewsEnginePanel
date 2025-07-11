import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table'; // MatTableDataSource eklendi
import { NewsService } from '../services/news.service';
import { Haber } from '../services/news.service';

@Component({
  selector: 'app-most-read-clicked',
  standalone: true,
  imports: [CommonModule, MatTableModule], // MatTableModule zaten var
  templateUrl: './most-read-clicked.component.html',
  styleUrls: ['./most-read-clicked.component.css']
})
export class MostReadClickedComponent implements OnInit {
  displayedColumns: string[] = ['baslik', 'icerik', 'yayinTarihi', 'okunmaSayisi', 'tiklanmaSayisi'];
  mostReadNews = new MatTableDataSource<Haber>([]); // MatTableDataSource kullanıyoruz
  mostClickedNews = new MatTableDataSource<Haber>([]); // MatTableDataSource kullanıyoruz

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadMostReadNews();
    this.loadMostClickedNews();
  }

  loadMostReadNews(): void {
    this.newsService.getMostReadNews().subscribe({
      next: (haberler) => {
        console.log('En çok okunan haberler:', haberler); // Veriyi kontrol et
        this.mostReadNews.data = haberler; // MatTableDataSource'a veri ata
      },
      error: (err) => {
        console.error('En çok okunan haberler yüklenemedi:', err);
      }
    });
  }

  loadMostClickedNews(): void {
    this.newsService.getMostClickedNews().subscribe({
      next: (haberler) => {
        console.log('En çok tıklanan haberler:', haberler); // Veriyi kontrol et
        this.mostClickedNews.data = haberler; // MatTableDataSource'a veri ata
      },
      error: (err) => {
        console.error('En çok tıklanan haberler yüklenemedi:', err);
      }
    });
  }

  truncateText(text: string, length: number): string {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }
}