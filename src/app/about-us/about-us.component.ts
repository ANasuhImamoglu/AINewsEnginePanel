
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="about-container">
      <mat-card class="about-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>info</mat-icon>
            Hakkımızda
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="about-content">
            <h3>AI News Engine Panel</h3>
            <p>
              Yapay zeka destekli haber yönetim sistemi. Bu platform, modern teknolojiler 
              kullanarak haberleri yönetmek ve kullanıcı etkileşimlerini takip etmek için 
              geliştirilmiştir.
            </p>
            
            <h4>Özellikler:</h4>
            <ul>
              <li>Haber yönetimi ve görüntüleme</li>
              <li>Kullanıcı kayıt ve giriş sistemi</li>
              <li>Yorum sistemi</li>
              <li>En çok okunan haberler takibi</li>
              <li>Responsive tasarım</li>
            </ul>
            
            <h4>Teknolojiler:</h4>
            <ul>
              <li>Angular 17+</li>
              <li>Angular Material</li>
              <li>TypeScript</li>
              <li>RxJS</li>
            </ul>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .about-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
    }
    
    .about-card {
      width: 100%;
    }
    
    .about-content h3 {
      color: #1976d2;
      margin-bottom: 16px;
    }
    
    .about-content h4 {
      color: #333;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    
    .about-content p {
      line-height: 1.6;
      color: #666;
      margin-bottom: 16px;
    }
    
    .about-content ul {
      padding-left: 20px;
    }
    
    .about-content li {
      margin-bottom: 8px;
      color: #666;
    }
    
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class AboutUsComponent {
}
