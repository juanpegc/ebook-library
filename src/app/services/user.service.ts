import { Injectable } from '@angular/core';
import { User } from '../models/user';
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
export class UserService {
  private serverUrl = environment.server.url + ':' + environment.server.port;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error(error);
    return throwError(error);
  }

  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.serverUrl}/users`)
      .pipe(catchError(this.handleError));
  }

  getUser(id: string): Observable<any> {
    return this.http
      .get(`${this.serverUrl}/users/${id}`)
      .pipe(catchError(this.handleError));
  }

  getNickname(id: string): Observable<any> {
    return this.http
      .get(`${this.serverUrl}/users/getNickname/${id}`)
      .pipe(catchError(this.handleError));
  }

  getIdUser(email: string): Observable<User> {
    return this.http
      .get<User>(`${this.serverUrl}/users/getIduserByEmail/${email}`)
      .pipe(catchError(this.handleError));
  }

  addUser(user: User): Observable<any> {
    return this.http
      .post(`${this.serverUrl}/users`, {
        id: user.sub,
        email: user.email,
        nickname: user.nickname,
      })
      .pipe(catchError(this.handleError));
  }

  updateUser(id: string, nuevoNombre: string): Observable<any> {
    return this.http
      .put(`${this.serverUrl}/users/newName/${id}`, {
        newName: nuevoNombre,
      })
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: string): Observable<any> {
    return this.http
      .delete(`${this.serverUrl}/users/${id}`)
      .pipe(catchError(this.handleError));
  }
}
