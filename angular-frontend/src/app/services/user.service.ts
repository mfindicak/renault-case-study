import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUser } from '../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userApiUrl = 'http://localhost:3000/users';

  headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
  });

  constructor(private http: HttpClient) {}

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.userApiUrl, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  getUserById(user_id: number): Observable<IUser> {
    return this.http.get<IUser>(this.userApiUrl + '/' + user_id, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  addUser(userObject: IUser): Observable<any> {
    return this.http.post<any>(this.userApiUrl, userObject, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  updateUser(user_id: number, userObject: IUser): Observable<any> {
    return this.http.put<any>(this.userApiUrl + '/' + user_id, userObject, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  deleteUser(user_id: number): Observable<IUser[]> {
    return this.http.delete<IUser[]>(this.userApiUrl + '/' + user_id, {
      headers: this.headers,
      withCredentials: true,
    });
  }
}
