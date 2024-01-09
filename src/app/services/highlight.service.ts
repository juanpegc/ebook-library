import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Highlight } from '../models/highlight';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HighlightService {
  private serverUrl = environment.server.url + ':' + environment.server.port;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error(error);
    return throwError(error);
  }

  getHighlightsByBook(idBook: string): Observable<Highlight[]> {
    return this.http
      .get<Highlight[]>(`${this.serverUrl}/highlights/book/${idBook}`)
      .pipe(catchError(this.handleError));
  }

  getHighlightsByUser(idUser: string): Observable<Highlight[]> {
    return this.http
      .get<Highlight[]>(`${this.serverUrl}/highlights/user/${idUser}`)
      .pipe(catchError(this.handleError));
  }

  addHighlight(idUser: string, highlight: Highlight): Observable<any> {
    const params = {
      libro: highlight.idLibro,
      usuario: idUser,
      range: highlight.cfiRange,
      texto: highlight.texto,
      nombreLibro: highlight.nombreLibro,
    };
    return this.http
      .post(`${this.serverUrl}/highlights/`, params)
      .pipe(catchError(this.handleError));
  }

  removeHighlight(idHighlight: string): Observable<any> {
    return this.http
      .delete(`${this.serverUrl}/highlights/${idHighlight}`)
      .pipe(catchError(this.handleError));
  }
}
