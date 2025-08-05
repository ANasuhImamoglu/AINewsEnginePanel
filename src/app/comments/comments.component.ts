import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CommentsService, Comment, Reply } from '../services/comments.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() haberId: number = 1; // Parent component'den haber ID'si alınacak
  
  comments: Comment[] = [];
  newComment: string = '';
  replyContents: { [key: number]: string } = {};
  isLoading: boolean = false;

  constructor(
    private commentsService: CommentsService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log('Comments Component Init');
    console.log('Is Logged In:', this.isLoggedIn());
    console.log('Current User:', this.authService.getCurrentUser());
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading = true;
    console.log('Loading comments for haber ID:', this.haberId);
    this.commentsService.getComments(this.haberId).subscribe({
      next: (comments: Comment[]) => {
        console.log('Comments received:', comments);
        this.comments = comments.map((comment: Comment) => ({
          ...comment,
          showReplies: false,
          showReplyForm: false
        }));
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Yorumlar yüklenirken hata:', error);
        this.showMessage('Yorumlar yüklenirken hata oluştu');
        this.isLoading = false;
      }
    });
  }

  addComment(): void {
    if (!this.newComment.trim()) {
      this.showMessage('Yorum içeriği boş olamaz');
      return;
    }

    const comment = {
      content: this.newComment,
      author: this.authService.getCurrentUsername(),
      authorId: this.authService.getCurrentUserId(),
      haberId: this.haberId
    };

    this.commentsService.addComment(comment).subscribe({
      next: (newComment: Comment) => {
        this.comments.unshift({
          ...newComment,
          showReplies: false,
          showReplyForm: false
        });
        this.newComment = '';
        this.showMessage('Yorum başarıyla eklendi');
      },
      error: (error: any) => {
        console.error('Yorum eklenirken hata:', error);
        this.showMessage('Yorum eklenirken hata oluştu');
      }
    });
  }

  toggleReplies(comment: Comment): void {
    comment.showReplies = !comment.showReplies;
    if (comment.showReplies && (!comment.replies || comment.replies.length === 0)) {
      this.loadReplies(comment.id);
    }
  }

  toggleReplyForm(comment: Comment): void {
    comment.showReplyForm = !comment.showReplyForm;
    if (!comment.showReplyForm) {
      this.replyContents[comment.id] = '';
    }
  }

  loadReplies(commentId: number): void {
    this.commentsService.getReplies(commentId).subscribe({
      next: (replies: Reply[]) => {
        const comment = this.comments.find(c => c.id === commentId);
        if (comment) {
          if (!comment.replies) {
            comment.replies = [];
          }
          comment.replies = replies;
        }
      },
      error: (error: any) => {
        console.error('Yanıtlar yüklenirken hata:', error);
        this.showMessage('Yanıtlar yüklenirken hata oluştu');
      }
    });
  }

  addReply(commentId: number): void {
    const replyContent = this.replyContents[commentId];
    if (!replyContent?.trim()) {
      this.showMessage('Yanıt içeriği boş olamaz');
      return;
    }

    const reply = {
      content: replyContent,
      author: this.authService.getCurrentUsername(),
      authorId: this.authService.getCurrentUserId(),
      commentId: commentId
    };

    this.commentsService.addReply(reply).subscribe({
      next: (newReply: Reply) => {
        const comment = this.comments.find(c => c.id === commentId);
        if (comment) {
          if (!comment.replies) {
            comment.replies = [];
          }
          comment.replies.push(newReply);
          comment.showReplies = true;
        }
        this.replyContents[commentId] = '';
        this.showMessage('Yanıt başarıyla eklendi');
      },
      error: (error: any) => {
        console.error('Yanıt eklenirken hata:', error);
        this.showMessage('Yanıt eklenirken hata oluştu');
      }
    });
  }

  reactToComment(commentId: number, reaction: 'like' | 'dislike'): void {
    this.commentsService.reactToComment(commentId, reaction).subscribe({
      next: (response: any) => {
        const comment = this.comments.find(c => c.id === commentId);
        if (comment) {
          comment.likes = response.likes;
          comment.dislikes = response.dislikes;
          comment.userReaction = response.userReaction;
        }
      },
      error: (error: any) => {
        console.error('Reaksiyon eklenirken hata:', error);
        this.showMessage('Reaksiyon eklenirken hata oluştu');
      }
    });
  }

  reactToReply(replyId: number, reaction: 'like' | 'dislike'): void {
    this.commentsService.reactToReply(replyId, reaction).subscribe({
      next: (response: any) => {
        for (const comment of this.comments) {
          if (comment.replies) {
            const reply = comment.replies.find((r: Reply) => r.id === replyId);
            if (reply) {
              reply.likes = response.likes;
              reply.dislikes = response.dislikes;
              reply.userReaction = response.userReaction;
              break;
            }
          }
        }
      },
      error: (error: any) => {
        console.error('Reaksiyon eklenirken hata:', error);
        this.showMessage('Reaksiyon eklenirken hata oluştu');
      }
    });
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Kapat', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
