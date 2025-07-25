import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface YorumDto {
  id: number;
  icerik: string;
  olusturmaTarihi: string;
  kullaniciAdi: string;
  kullaniciId: string;
  haberId: number;
  onaylandi: boolean;
  likeSayisi: number;
  dislikeSayisi: number;
  yanitSayisi: number;
  kullaniciLikeDurumu?: boolean | null;
  yanitlar: YorumYanitiDto[];
}

export interface YorumYanitiDto {
  id: number;
  icerik: string;
  olusturmaTarihi: string;
  kullaniciAdi: string;
  kullaniciId: string;
  yorumId: number;
  onaylandi: boolean;
  likeSayisi: number;
  dislikeSayisi: number;
  kullaniciLikeDurumu?: boolean | null;
}

export interface YorumLikeDto {
  isLike: boolean;
}

export interface YorumYanitiEkleDto {
  icerik: string;
}

export interface YorumEkleDto {
  icerik: string;
  haberId: number;
  ustYorumId?: number;
}

export interface Comment {
  id: number;
  yorum: string;
  tarih: string;
  kullaniciAdi: string;
  kullaniciId: number;
  haberId: number;
  onayDurumu: boolean;
  begeniSayisi: number;
  begenmemeSayisi: number;
  ustYorumId?: number;
  yanitlar: Reply[];
  showReplies?: boolean;
  showReplyForm?: boolean;
  likes?: number;
  dislikes?: number;
  userReaction?: 'like' | 'dislike' | null;
  replies?: Reply[];
}

export interface Reply {
  id: number;
  yorum: string;
  tarih: string;
  kullaniciAdi: string;
  kullaniciId: number;
  ustYorumId: number;
  likes?: number;
  dislikes?: number;
  userReaction?: 'like' | 'dislike' | null;
}

export interface AddCommentRequest {
  content: string;
  author: string;
  authorId: number;
  haberId: number;
}

export interface AddReplyRequest {
  content: string;
  author: string;
  authorId: number;
  commentId: number;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = `${environment.apiUrl}/api/Yorumlar`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private mapBackendToFrontend = (dto: YorumDto): Comment => {
    return {
      id: dto.id,
      yorum: dto.icerik,
      tarih: dto.olusturmaTarihi,
      kullaniciAdi: dto.kullaniciAdi,
      kullaniciId: parseInt(dto.kullaniciId),
      haberId: dto.haberId,
      onayDurumu: dto.onaylandi,
      begeniSayisi: dto.likeSayisi,
      begenmemeSayisi: dto.dislikeSayisi,
      ustYorumId: undefined,
      yanitlar: dto.yanitlar?.map(this.mapReplyBackendToFrontend) || [],
      likes: dto.likeSayisi,
      dislikes: dto.dislikeSayisi,
      replies: dto.yanitlar?.map(this.mapReplyBackendToFrontend) || [],
      showReplies: false,
      showReplyForm: false,
      userReaction: dto.kullaniciLikeDurumu === true ? 'like' : dto.kullaniciLikeDurumu === false ? 'dislike' : null
    };
  };

  private mapReplyBackendToFrontend = (dto: YorumYanitiDto): Reply => {
    return {
      id: dto.id,
      yorum: dto.icerik,
      tarih: dto.olusturmaTarihi,
      kullaniciAdi: dto.kullaniciAdi,
      kullaniciId: parseInt(dto.kullaniciId),
      ustYorumId: dto.yorumId,
      likes: dto.likeSayisi,
      dislikes: dto.dislikeSayisi,
      userReaction: dto.kullaniciLikeDurumu === true ? 'like' : dto.kullaniciLikeDurumu === false ? 'dislike' : null
    };
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }

  getCommentsByNewsId(haberId: number): Observable<Comment[]> {
    console.log('Fetching comments for news ID:', haberId);
    
    return this.http.get<any>(`${this.apiUrl}/haber/${haberId}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        console.log('Raw backend response:', response);
        // Backend paginated format: { items: [], pagination: {...} }
        const comments = response.items || response;
        console.log('Extracted comments:', comments);
        const mappedComments = Array.isArray(comments) ? comments.map(this.mapBackendToFrontend) : [];
        console.log('Mapped comments:', mappedComments);
        return mappedComments;
      }),
      catchError((error) => {
        console.error('Error fetching comments:', error);
        return this.handleError<Comment[]>('getCommentsByNewsId', [])(error);
      })
    );
  }

  getComments(haberId: number = 1): Observable<Comment[]> {
    return this.getCommentsByNewsId(haberId);
  }

  addComment(request: AddCommentRequest | { haberId: number; yorum: string }): Observable<Comment> {
    let commentText: string;
    let haberId: number;
    
    if ('content' in request) {
      commentText = request.content;
      haberId = request.haberId;
    } else {
      commentText = request.yorum;
      haberId = request.haberId;
    }

    console.log('Adding comment with text:', commentText);

    // Backend için doğru format: YorumEkleDto
    let backendRequest = {
      icerik: commentText,
      haberId: haberId
    };

    return this.http.post<YorumDto>(`${this.apiUrl}`, backendRequest, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        console.log('Add comment response:', response);
        return this.mapBackendToFrontend(response);
      }),
      catchError((error) => {
        console.error('Error adding comment:', error);
        return this.handleError<Comment>('addComment')(error);
      })
    );
  }

  getReplies(commentId: number): Observable<Reply[]> {
    // Backend'de yorumun yanıtları zaten ana response'ta geliyor
    // Bu metod şimdilik empty array döndürüyor çünkü yanıtlar ana comment'te geliyor
    return of([]);
  }

  addReply(request: AddReplyRequest | { ustYorumId: number; yorum: string }): Observable<Reply> {
    let replyText: string;
    let commentId: number;
    
    if ('content' in request) {
      replyText = request.content;
      commentId = request.commentId;
    } else {
      replyText = request.yorum;
      commentId = request.ustYorumId;
    }

    console.log('Adding reply with text:', replyText, 'to comment:', commentId);

    // Backend için doğru format: YorumYanitiEkleDto
    let backendRequest = {
      icerik: replyText
    };

    return this.http.post<YorumYanitiDto>(`${this.apiUrl}/${commentId}/yanitlar`, backendRequest, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        console.log('Add reply response:', response);
        return this.mapReplyBackendToFrontend(response);
      }),
      catchError((error) => {
        console.error('Error adding reply:', error);
        return this.handleError<Reply>('addReply')(error);
      })
    );
  }

  reactToComment(commentId: number, reactionOrBoolean: boolean | 'like' | 'dislike'): Observable<any> {
    let isLike: boolean;
    
    if (typeof reactionOrBoolean === 'boolean') {
      isLike = reactionOrBoolean;
    } else {
      isLike = reactionOrBoolean === 'like';
    }
    
    console.log(`Reacting to comment ${commentId} with like: ${isLike}`);
    
    // Backend için doğru format: YorumLikeDto
    const backendRequest = {
      isLike: isLike
    };

    return this.http.post<any>(`${this.apiUrl}/${commentId}/like`, backendRequest, {
      headers: this.getHeaders()
    }).pipe(
      switchMap(response => {
        console.log('React to comment response:', response);
        // Güncellenmiş yorum bilgilerini almak için yeniden fetch
        return this.http.get<YorumDto>(`${this.apiUrl}/${commentId}`, {
          headers: this.getHeaders()
        }).pipe(
          map(updatedComment => ({
            likes: updatedComment.likeSayisi,
            dislikes: updatedComment.dislikeSayisi,
            userReaction: isLike ? 'like' : 'dislike'
          }))
        );
      }),
      catchError((error) => {
        console.error('Error reacting to comment:', error);
        return this.handleError('reactToComment')(error);
      })
    );
  }

  reactToReply(replyId: number, reaction: 'like' | 'dislike'): Observable<any> {
    const endpoint = reaction === 'like' ? 'begen' : 'begenme';
    return this.http.post<any>(`${this.apiUrl}/${replyId}/${endpoint}`, {}, {
      headers: this.getHeaders()
    }).pipe(
      map(response => ({
        likes: response?.begeniSayisi || 0,
        dislikes: response?.begenmemeSayisi || 0,
        userReaction: reaction
      })),
      catchError(this.handleError('reactToReply'))
    );
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${commentId}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError('deleteComment'))
    );
  }

  approveComment(commentId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${commentId}/onayla`, {}, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError('approveComment'))
    );
  }

  rejectComment(commentId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${commentId}/reddet`, {}, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError('rejectComment'))
    );
  }
}
