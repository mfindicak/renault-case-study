import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRole } from '../interfaces/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  roleApiUrl = 'http://localhost:3000/roles';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<IRole[]> {
    return this.http.get<IRole[]>(this.roleApiUrl, { withCredentials: true });
  }
}
