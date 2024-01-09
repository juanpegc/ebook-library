import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private serverUrl = environment.server.url + ':' + environment.server.port;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error(error);
    return throwError(error);
  }

  getCommentsByBook(idBook: string): Observable<Comment[]> {
    return this.http
      .get<Comment[]>(`${this.serverUrl}/comments/book/${idBook}`)
      .pipe(catchError(this.handleError));
  }

  getCommentsByUser(idUser: string): Observable<Comment[]> {
    return this.http
      .get<Comment[]>(`${this.serverUrl}/comments/user/${idUser}`)
      .pipe(catchError(this.handleError));
  }

  addComment(comment: Comment): Observable<any> {
    const params = {
      texto: comment.texto,
      usuario: comment.idUser,
      libro: comment.idLibro,
      nombreLibro: comment.nombreLibro,
    };
    return this.http
      .post(`${this.serverUrl}/comments/`, params)
      .pipe(catchError(this.handleError));
  }

  modifyComment(id: string, texto: string): Observable<Comment> {
    return this.http
      .put<Comment>(`${this.serverUrl}/comments/${id}`, {
        texto: texto,
      })
      .pipe(catchError(this.handleError));
  }

  removeComment(id: string): Observable<any> {
    return this.http
      .delete(`${this.serverUrl}/comments/${id}`)
      .pipe(catchError(this.handleError));
  }
}
