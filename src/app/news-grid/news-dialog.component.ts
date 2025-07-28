import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewsService } from '../services/news.service';
import { Haber } from '../services/news.service';
import { CommentsService, Comment } from '../services/comments.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-news-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule
  ],
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
          <p>{{ data.okunmaSayisi }}</p>
        </div>
        <div class="detail-item">
          <strong>Tıklanma Sayısı:</strong>
          <p>{{ data.tiklanmaSayisi }}</p>
        </div>
      </div>

      <mat-divider></mat-divider>
      
      <!-- Yorum Sistemi -->
      <div class="comments-section">
        <h3>Yorumlar</h3>
        
        <!-- Yorum Ekleme Formu -->
        <div class="comment-form" *ngIf="isLoggedIn">
          <form [formGroup]="commentForm" (ngSubmit)="addComment()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Yorumunuzu yazın</mat-label>
              <textarea 
                matInput 
                formControlName="text"
                rows="3"
                placeholder="Yorumunuzu buraya yazın..."></textarea>
            </mat-form-field>
            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              [disabled]="commentForm.invalid || isSubmitting">
              <mat-icon>send</mat-icon>
              Yorum Gönder
            </button>
          </form>
        </div>

        <div class="login-message" *ngIf="!isLoggedIn">
          <p>Yorum yapabilmek için giriş yapmanız gerekiyor.</p>
        </div>

        <!-- Yorumlar Listesi -->
        <div class="comments-list" *ngIf="comments.length > 0">
          <mat-card class="comment-card" *ngFor="let comment of comments">
            <mat-card-header>
              <mat-card-title class="comment-author">{{ comment.kullaniciAdi }}</mat-card-title>
              <mat-card-subtitle>{{ comment.tarih | date:'dd/MM/yyyy HH:mm' }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p class="comment-text">{{ comment.yorum }}</p>
            </mat-card-content>
            <mat-card-actions>
              <div class="comment-actions">
                <button 
                  mat-button 
                  (click)="reactToComment(comment.id, true)"
                  [disabled]="!isLoggedIn"
                  class="like-button">
                  <mat-icon>thumb_up</mat-icon>
                  {{ comment.begeniSayisi || 0 }}
                </button>
                <button 
                  mat-button 
                  (click)="reactToComment(comment.id, false)"
                  [disabled]="!isLoggedIn"
                  class="dislike-button">
                  <mat-icon>thumb_down</mat-icon>
                  {{ comment.begenmemeSayisi || 0 }}
                </button>
                <button 
                  mat-button 
                  (click)="toggleReplyForm(comment.id)"
                  [disabled]="!isLoggedIn">
                  <mat-icon>reply</mat-icon>
                  Yanıtla
                </button>
              </div>
            </mat-card-actions>

            <!-- Yanıt Formu -->
            <div class="reply-form" *ngIf="showReplyForm === comment.id">
              <form [formGroup]="replyForm" (ngSubmit)="addReply(comment.id)">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Yanıtınızı yazın</mat-label>
                  <textarea 
                    matInput 
                    formControlName="text"
                    rows="2"
                    placeholder="Yanıtınızı buraya yazın..."></textarea>
                </mat-form-field>
                <div class="reply-actions">
                  <button 
                    mat-button 
                    type="button"
                    (click)="cancelReply()">
                    İptal
                  </button>
                  <button 
                    mat-raised-button 
                    color="primary" 
                    type="submit"
                    [disabled]="replyForm.invalid || isSubmitting">
                    Yanıtla
                  </button>
                </div>
              </form>
            </div>

            <!-- Yanıtlar -->
            <div class="replies" *ngIf="comment.yanitlar && comment.yanitlar.length > 0">
              <mat-card class="reply-card" *ngFor="let reply of comment.yanitlar">
                <mat-card-header>
                  <mat-card-title class="reply-author">{{ reply.kullaniciAdi }}</mat-card-title>
                  <mat-card-subtitle>{{ reply.tarih | date:'dd/MM/yyyy HH:mm' }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p class="reply-text">{{ reply.yorum }}</p>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-card>
        </div>

        <div class="no-comments" *ngIf="comments.length === 0">
          <p>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
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

    /* Yorum Sistemi Stilleri */
    .comments-section {
      margin-top: 24px;
      padding-top: 16px;
    }

    .comments-section h3 {
      color: #1976d2;
      margin-bottom: 16px;
      font-size: 1.2em;
    }

    .comment-form {
      margin-bottom: 24px;
    }

    .full-width {
      width: 100%;
    }

    .login-message {
      text-align: center;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .login-message p {
      margin: 0;
      color: #666;
    }

    .comments-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .comment-card {
      margin-bottom: 16px;
      border-left: 3px solid #1976d2;
    }

    .comment-author {
      font-size: 14px;
      font-weight: 600;
      color: #1976d2;
    }

    .comment-text {
      margin: 8px 0;
      line-height: 1.5;
    }

    .comment-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .like-button {
      color: #4caf50;
    }

    .dislike-button {
      color: #f44336;
    }

    .reply-form {
      margin: 16px;
      padding: 16px;
      background-color: #f9f9f9;
      border-radius: 8px;
    }

    .reply-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 8px;
    }

    .replies {
      margin: 16px;
      border-left: 2px solid #e0e0e0;
      padding-left: 16px;
    }

    .reply-card {
      margin-bottom: 8px;
      background-color: #fafafa;
    }

    .reply-author {
      font-size: 12px;
      color: #666;
    }

    .reply-text {
      margin: 4px 0;
      font-size: 14px;
    }

    .no-comments {
      text-align: center;
      padding: 32px;
      color: #666;
    }
  `]
})
export class NewsDialogComponent implements OnInit {
  comments: Comment[] = [];
  commentForm: FormGroup;
  replyForm: FormGroup;
  isLoggedIn = false;
  isSubmitting = false;
  showReplyForm: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<NewsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Haber,
    private newsService: NewsService,
    private commentsService: CommentsService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.replyForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadComments();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    console.log('Login status in news dialog:', this.isLoggedIn);
  }

  loadComments(): void {
    this.commentsService.getCommentsByNewsId(this.data.id).subscribe({
      next: (comments: Comment[]) => {
        this.comments = comments;
        console.log('Comments loaded:', comments);
      },
      error: (error: any) => {
        console.error('Error loading comments:', error);
      }
    });
  }

  addComment(): void {
    if (this.commentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const commentData = {
        content: this.commentForm.get('text')?.value,
        author: this.authService.getCurrentUsername(),
        authorId: this.authService.getCurrentUserId(),
        haberId: this.data.id
      };

      this.commentsService.addComment(commentData).subscribe({
        next: (newComment: Comment) => {
          this.comments.unshift(newComment);
          this.commentForm.reset();
          this.isSubmitting = false;
          console.log('Comment added successfully');
        },
        error: (error: any) => {
          console.error('Error adding comment:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  reactToComment(commentId: number, isLike: boolean): void {
    const reaction = isLike ? 'like' : 'dislike';
    this.commentsService.reactToComment(commentId, reaction).subscribe({
      next: (response: any) => {
        // Tepki verilen yorumu güncelle
        const comment = this.comments.find(c => c.id === commentId);
        if (comment) {
          comment.begeniSayisi = response.likes || response.begeniSayisi || 0;
          comment.begenmemeSayisi = response.dislikes || response.begenmemeSayisi || 0;
        }
        console.log('Reaction added successfully', response);
      },
      error: (error: any) => {
        console.error('Error reacting to comment:', error);
      }
    });
  }

  toggleReplyForm(commentId: number): void {
    this.showReplyForm = this.showReplyForm === commentId ? null : commentId;
    if (this.showReplyForm) {
      this.replyForm.reset();
    }
  }

  addReply(parentCommentId: number): void {
    if (this.replyForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const replyData = {
        content: this.replyForm.get('text')?.value,
        author: this.authService.getCurrentUsername(),
        authorId: this.authService.getCurrentUserId(),
        commentId: parentCommentId
      };

      this.commentsService.addReply(replyData).subscribe({
        next: (newReply: any) => {
          // Yanıtı ilgili yoruma ekle
          const comment = this.comments.find(c => c.id === parentCommentId);
          if (comment) {
            if (!comment.yanitlar) {
              comment.yanitlar = [];
            }
            comment.yanitlar.push(newReply);
          }
          this.replyForm.reset();
          this.showReplyForm = null;
          this.isSubmitting = false;
          console.log('Reply added successfully');
        },
        error: (error: any) => {
          console.error('Error adding reply:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  cancelReply(): void {
    this.showReplyForm = null;
    this.replyForm.reset();
  }

  onClose(): void {
    this.dialogRef.close();
  }

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


  

