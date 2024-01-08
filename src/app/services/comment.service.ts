import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private serverUrl = environment.server.url + ':' + environment.server.port;

  constructor(private http: HttpClient) {}

  getCommentsByBook(idBook: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${this.serverUrl}/comments/book/${idBook}`
    );
  }

  getCommentsByUser(idUser: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${this.serverUrl}/comments/user/${idUser}`
    );
  }

  addComment(comment: Comment): Observable<any> {
    const params = {
      texto: comment.texto,
      usuario: comment.idUser,
      libro: comment.idLibro,
      nombreLibro: comment.nombreLibro,
    };
    return this.http.post(`${this.serverUrl}/comments/`, params);
  }

  modifyComment(id: string, texto: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.serverUrl}/comments/${id}`, {
      texto: texto,
    });
  }

  removeComment(id: string): Observable<any> {
    return this.http.delete(`${this.serverUrl}/comments/${id}`);
  }
}
