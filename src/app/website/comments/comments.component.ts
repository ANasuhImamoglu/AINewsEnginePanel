import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { CommentsService, Comment, AddCommentRequest, AddReplyRequest } from '../../services/comments.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, OnChanges {
  @Input() haberId!: number;
  
  comments: Comment[] = [];
  newComment = '';
  loading = true;
  submitting = false;
  replyText: { [key: number]: string } = {};
  showReplyForm: { [key: number]: boolean } = {};
  
  constructor(
    private commentsService: CommentsService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('CommentsComponent initialized with haberId:', this.haberId);
    if (this.haberId) {
      this.loadComments();
    } else {
      console.warn('No haberId provided to CommentsComponent');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['haberId'] && !changes['haberId'].firstChange) {
      console.log('haberId changed from', changes['haberId'].previousValue, 'to', changes['haberId'].currentValue);
      if (this.haberId) {
        this.loadComments();
      }
    }
  }

  loadComments(): void {
    console.log('Loading comments for haberId:', this.haberId);
    this.loading = true;
    this.commentsService.getCommentsByNewsId(this.haberId).subscribe({
      next: (comments: Comment[]) => {
        console.log('Received comments for haberId', this.haberId, ':', comments);
        this.comments = comments.filter(comment => comment.onayDurumu);
        console.log('Filtered approved comments:', this.comments);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Comments loading error for haberId', this.haberId, ':', error);
        this.loading = false;
      }
    });
  }

  submitComment(): void {
    if (!this.newComment.trim()) return;
    
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.submitting = true;
    const commentData: AddCommentRequest = {
      content: this.newComment.trim(),
      author: '', // Will be filled by backend from token
      authorId: 0, // Will be filled by backend from token
      haberId: this.haberId
    };

    this.commentsService.addComment(commentData).subscribe({
      next: () => {
        this.newComment = '';
        this.loadComments(); // Yorumları yenile
        this.submitting = false;
      },
      error: (error: any) => {
        console.error('Comment submit error:', error);
        this.submitting = false;
      }
    });
  }

  toggleReply(commentId: number): void {
    this.showReplyForm[commentId] = !this.showReplyForm[commentId];
    if (!this.showReplyForm[commentId]) {
      this.replyText[commentId] = '';
    }
  }

  submitReply(commentId: number): void {
    const replyContent = this.replyText[commentId];
    if (!replyContent?.trim()) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const replyData: AddReplyRequest = {
      content: replyContent.trim(),
      author: '', // Will be filled by backend from token
      authorId: 0, // Will be filled by backend from token
      commentId: commentId
    };

    this.commentsService.addReply(replyData).subscribe({
      next: () => {
        this.replyText[commentId] = '';
        this.showReplyForm[commentId] = false;
        this.loadComments();
      },
      error: (error: any) => {
        console.error('Reply submit error:', error);
      }
    });
  }

  likeComment(commentId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.commentsService.reactToComment(commentId, 'like').subscribe({
      next: () => {
        this.loadComments();
      },
      error: (error: any) => {
        console.error('Like error:', error);
      }
    });
  }

  dislikeComment(commentId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.commentsService.reactToComment(commentId, 'dislike').subscribe({
      next: () => {
        this.loadComments();
      },
      error: (error: any) => {
        console.error('Dislike error:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Şimdi';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getLikeButtonClass(comment: Comment): string {
    if (comment.userReaction === 'like') return 'liked';
    return '';
  }

  getDislikeButtonClass(comment: Comment): string {
    if (comment.userReaction === 'dislike') return 'disliked';
    return '';
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
