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

  addUser(userObject: object): Observable<any> {
    return this.http.post(this.userApiUrl, userObject, {
      responseType: 'text',
      withCredentials: true,
    });
  }

  updateUser(userObject: IUser): Observable<any> {
    return this.http.put(
      this.userApiUrl + '/' + userObject.user_id,
      userObject,
      {
        responseType: 'text', //PUT request is only returning status code. This is need for it if we don't wanna get error.
        withCredentials: true, //This is for send our accestoken via cookie.
      }
    );
  }

  deleteUser(user_id: number): Observable<any> {
    return this.http.delete(this.userApiUrl + '/' + user_id, {
      responseType: 'text',
      withCredentials: true,
    });
  }
}
