import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NewsService } from '../services/news.service'; // NewsService'i import edin
import { Haber } from '../services/news.service'; // Haber modelini import edin


@Component({
  selector: 'app-news-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `

<div class="dialog-container">
    <h2 mat-dialog-title>{{ data.baslik }}</h2>
    <mat-dialog-content class="dialog-content">
      <div class="news-details">
        <div class="detail-item">
          <strong>İçerik:</strong>
          <p>{{ data.icerik }}</p>
        </div>
        <div class="detail-item">
          <strong>Yayın Tarihi:</strong>
          <p>{{ data.yayinTarihi | date:'dd/MM/yyyy HH:mm' }}</p>
        </div>
        <div class="detail-item">
          <strong>Kategori ID:</strong>
          <p>{{ data.kategoriId || 'Belirtilmemiş' }}</p>
        </div>
        <div class="detail-item" *ngIf="data.resimUrl">
          <strong>Resim:</strong>
          <img [src]="data.resimUrl" alt="Haber Resmi" class="news-image">
        </div>
        <div class="detail-item">
          <strong>Durum:</strong>
          <span class="status-badge" [ngClass]="{'approved': data.onaylandi, 'pending': !data.onaylandi}">
            {{ data.onaylandi ? 'Onaylandı' : 'Onay Bekliyor' }}
          </span>
        </div>
        <div class="detail-item">
          <strong>Okunma Sayısı:</strong>
          <p>{{ data.okunduSayisi }}</p>
        </div>
        <div class="detail-item">
          <strong>Tıklanma Sayısı:</strong>
          <p>{{ data.tiklandiSayisi }}</p>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button mat-dialog-close color="warn">
        <mat-icon>close</mat-icon>
        Kapat
      </button>
      <button mat-raised-button color="primary" (click)="onApprove()" *ngIf="!data.onaylandi">
        <mat-icon>check</mat-icon>
        Onayla
      </button>
    </mat-dialog-actions>
  </div>
  `,
  styles: [`
    .dialog-container {
      max-width: 600px;
    }
    
    .dialog-content {
      max-height: 500px;
      overflow-y: auto;
    }
    
    .news-details {
      padding: 16px 0;
    }
    
    .detail-item {
      margin-bottom: 16px;
    }
    
    .detail-item strong {
      color: #424242;
      display: block;
      margin-bottom: 8px;
    }
    
    .detail-item p {
      margin: 0;
      line-height: 1.5;
      color: #666;
    }
    
    .news-image {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }
    
    .status-badge.approved {
      background-color: #e8f5e8;
      color: #2e7d32;
    }
    
    .status-badge.pending {
      background-color: #fff3e0;
      color: #f57c00;
    }
    
    .dialog-actions {
      padding: 16px 0;
      border-top: 1px solid #e0e0e0;
      margin-top: 16px;
    }
    
    .mat-raised-button, .mat-button {
      margin-left: 8px;
    }
    
    .mat-icon {
      margin-right: 4px;
      font-size: 18px;
      height: 18px;
      width: 18px;
    }
  `]
})
export class NewsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NewsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Haber,
    private newsService: NewsService // NewsService'i enjekte edin
  ) {}

  onApprove(): void {
   /* this.dialogRef.close('approve');*/
   this.newsService.approveNews(this.data.id).subscribe({
      next: (updatedHaber) => {
        this.data = updatedHaber; // Güncellenmiş haberi al
        this.dialogRef.close('approve'); // Pop-up'ı kapat ve 'approve' sonucunu döndür
      },
      error: (err) => {
        console.error('Haber onaylanamadı:', err);
      }
    });
  }
}


  

