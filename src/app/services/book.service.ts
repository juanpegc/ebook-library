import { Injectable } from '@angular/core';
import { Book } from '../models/book';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private serverUrl = environment.server.url + ':' + environment.server.port;

  constructor(private http: HttpClient) {}

  getAllBooksByUser(idUser: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.serverUrl}/books/user/${idUser}`);
  }

  getBook(id: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.serverUrl}/books/${id}`);
  }

  getBookUrl(name: string): Observable<any> {
    return this.http.get(`${this.serverUrl}/books/url/${name}`);
  }

  //Conseguir posición de donde se dejó por última vez
  getCurrentPosition(id: string): Observable<any> {
    return this.http.get(`${this.serverUrl}/books/${id}/position`);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(`${this.serverUrl}/books`, {
      nombre: book.nombre,
      userID: book.userID,
    });
  }

  addCurrentPosition(currentPosition: string, idBook: string): Observable<any> {
    return this.http.post(`${this.serverUrl}/books/${idBook}/position`, {
      position: currentPosition,
    });
  }

  updateBook(book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.serverUrl}/books`, book);
  }

  deleteBook(id: string): Observable<any> {
    return this.http.delete(`${this.serverUrl}/books/${id}`);
  }

  deleteBookFromS3(nombre: string): Observable<any> {
    return this.http.delete(`${this.serverUrl}/books/s3/${nombre}`);
  }

  uploadBook(file: File | undefined | null): Observable<any> {
    if (!file) {
      return throwError('No se proporcionó un archivo.');
    }
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.serverUrl}/books/upload`, formData);
  }
}
