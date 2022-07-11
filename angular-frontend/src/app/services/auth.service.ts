import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IToken } from '../interfaces/token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authApiUrl = 'http://localhost:3000';

  headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
  });

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<IToken> {
    return this.http.post<IToken>(
      this.authApiUrl + '/login',
      {
        username: username,
        password: password,
      },
      { headers: this.headers, withCredentials: true }
    );
  }

  refreshToken(): Observable<IToken> {
    return this.http.post<IToken>(
      this.authApiUrl + '/refresh',
      {},
      { headers: this.headers, withCredentials: true }
    );
  }
}
