import { Injectable } from '@angular/core';
import { Book } from '../models/book';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private serverUrl = environment.server.url + ':' + environment.server.port;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error(error);
    return throwError(error);
  }

  getAllBooksByUser(idUser: string): Observable<Book[]> {
    return this.http
      .get<Book[]>(`${this.serverUrl}/books/user/${idUser}`)
      .pipe(catchError(this.handleError));
  }

  getBook(id: string): Observable<Book[]> {
    return this.http
      .get<Book[]>(`${this.serverUrl}/books/${id}`)
      .pipe(catchError(this.handleError));
  }

  getBookUrl(name: string): Observable<any> {
    return this.http
      .get(`${this.serverUrl}/books/url/${name}`)
      .pipe(catchError(this.handleError));
  }

  //Conseguir posición de donde se dejó por última vez
  getCurrentPosition(id: string): Observable<any> {
    return this.http
      .get(`${this.serverUrl}/books/${id}/position`)
      .pipe(catchError(this.handleError));
  }

  addBook(book: Book): Observable<Book> {
    return this.http
      .post<Book>(`${this.serverUrl}/books`, {
        nombre: book.nombre,
        userID: book.userID,
      })
      .pipe(catchError(this.handleError));
  }

  addRealName(idBook: string, nombre: string): Observable<any> {
    return this.http
      .put(`${this.serverUrl}/books/${idBook}/addRealName`, { nombre: nombre })
      .pipe(catchError(this.handleError));
  }

  addCurrentPosition(currentPosition: string, idBook: string): Observable<any> {
    return this.http
      .put(`${this.serverUrl}/books/${idBook}/addPosition`, {
        position: currentPosition,
      })
      .pipe(catchError(this.handleError));
  }

  addDate(idBook: string, date: string): Observable<any> {
    return this.http
      .put(`${this.serverUrl}/books/${idBook}/addDate`, { date: date })
      .pipe(catchError(this.handleError));
  }

  removeDate(idBook: string): Observable<any> {
    return this.http
      .put(`${this.serverUrl}/books/${idBook}/removeDate`, null)
      .pipe(catchError(this.handleError));
  }

  updateBook(book: Book): Observable<Book> {
    return this.http
      .put<Book>(`${this.serverUrl}/books`, book)
      .pipe(catchError(this.handleError));
  }

  deleteBook(id: string): Observable<any> {
    return this.http
      .delete(`${this.serverUrl}/books/${id}`)
      .pipe(catchError(this.handleError));
  }

  deleteBookFromS3(nombre: string): Observable<any> {
    return this.http
      .delete(`${this.serverUrl}/books/s3/${nombre}`)
      .pipe(catchError(this.handleError));
  }

  uploadBook(file: File | undefined | null): Observable<any> {
    if (!file) {
      return throwError('No se proporcionó un archivo.');
    }
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<any>(`${this.serverUrl}/books/upload`, formData)
      .pipe(catchError(this.handleError));
  }

  addRating(idBook: string, rating: number): Observable<any> {
    return this.http.put(`${this.serverUrl}/books/${idBook}/addRating`, {
      rating: rating,
    });
  }

  removeRating(idBook: string): Observable<any> {
    return this.http.put(`${this.serverUrl}/books/${idBook}/removeRating`, {
      rating: null,
    });
  }
}
