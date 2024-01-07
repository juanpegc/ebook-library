import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private serverUrl = environment.server.url + ':' + environment.server.port;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.serverUrl}/users`);
  }

  getUser(id: string): Observable<any> {
    return this.http.get(`${this.serverUrl}/users/${id}`);
  }

  getNickname(id: string): Observable<any> {
    return this.http.get(`${this.serverUrl}/users/getNickname/${id}`);
  }

  getIdUser(email: string): Observable<User> {
    return this.http.get<User>(
      `${this.serverUrl}/users/getIduserByEmail/${email}`
    );
  }

  addUser(user: User): Observable<any> {
    return this.http.post(`${this.serverUrl}/users`, {
      id: user.sub,
      email: user.email,
      nickname: user.nickname,
    });
  }

  updateUser(id: string, nuevoNombre: string): Observable<any> {
    return this.http.put(`${this.serverUrl}/users/newName/${id}`, {
      newName: nuevoNombre,
    });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.serverUrl}/users/${id}`);
  }
}
