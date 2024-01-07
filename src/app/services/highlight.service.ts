import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Highlight } from '../models/highlight';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HighlightService {
  private serverUrl = environment.server.url + ':' + environment.server.port;

  constructor(private http: HttpClient) {}

  getHighlightsByBook(idBook: string): Observable<Highlight[]> {
    return this.http.get<Highlight[]>(
      `${this.serverUrl}/highlights/book/${idBook}`
    );
  }

  getHighlightsByUser(idUser: string): Observable<Highlight[]> {
    return this.http.get<Highlight[]>(
      `${this.serverUrl}/highlights/user/${idUser}`
    );
  }

  addHighlight(idUser: string, highlight: Highlight): Observable<any> {
    const params = {
      libro: highlight.idLibro,
      usuario: idUser,
      range: highlight.cfiRange,
      texto: highlight.texto,
      nombreLibro: highlight.nombreLibro,
    };
    return this.http.post(`${this.serverUrl}/highlights/`, params);
  }

  removeHighlight(idHighlight: string): Observable<any> {
    return this.http.delete(`${this.serverUrl}/highlights/${idHighlight}`);
  }
}
